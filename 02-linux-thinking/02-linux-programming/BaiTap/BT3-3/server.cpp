#include <iostream>
using namespace std;
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h> 
#include <string.h> 
#include <vector>
#include <netdb.h> 
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/socket.h> 
#include <sys/types.h> 
#include <pthread.h>

#define PORT 8080 
#define SA struct sockaddr 

//====================================================================
//GLOBAL VARIABLES
vector<int> marbleArray, dupMarbleArray;
pthread_mutex_t lock;


//====================================================================
//DECLARE FUNCTIONS
vector<int> randomArray();
void *run(void *argsock);
void func_test(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
vector<int> randomArray() {
	srand(time(NULL));
	int arrsize = rand()%898 + 101; //Value belongs to [101, 999]
	vector<int> newarr;

	for (int i=0; i<arrsize; ++i) {
		newarr.push_back(rand() % 1000); //The maximum value received from randomization is 1000
	}

	return newarr;
}

void *run(void *argsock) {
	/* Get the socket descriptor */
	int sock = *((int *) argsock);
	char buffer[256];

	while(1) {
		/* Receive "RequestMarble" from client */
		bzero(buffer, 256);
		read(sock, buffer, 255);
		if (strcmp(buffer,"RequestMarble") == 0) 
		{
			/* Send first value of marble array to client */
			pthread_mutex_lock(&lock);
			if (dupMarbleArray.size() != 0) 
			{
				int val = htonl(dupMarbleArray[0]);
				dupMarbleArray.erase(dupMarbleArray.begin());
				write(sock, &val, sizeof(val));
			}
			/* Send -1 (out of stock) */
			else 
			{
				int val = htonl(-1);
				write(sock, &val, sizeof(val));
			}
			pthread_mutex_unlock(&lock);
		}
	}


	/* Announce quantity of marbles */
	// int var = htonl(dupMarbleArray.size());
	// write(sock, &var, sizeof(var));

	// /* Receive "RequestMarble" from client */
	// read(sock, buffer, 255);
	// if (strcmp(buffer,"RequestMarble") == 0) 
	// {
	// 	/* Send first value of marble array to client */
	// 	if (dupMarbleArray.size() != 0) 
	// 	{
	// 		int val = htonl(dupMarbleArray[0]);
	// 		dupMarbleArray.erase(dupMarbleArray.begin());
	// 		write(sock, &val, sizeof(val));
	// 	}
	// 	/* Send out of stock */
	// 	else 
	// 	{
	// 		write(sock, "OutOfStock", 10);
	// 	}
	// }

	/* Close socket & thread */
    close(sock);
    pthread_exit(NULL); 
}

void func_test(int sock) {
	int check;
	char buffer[256];
	bzero(buffer, 256);

	while (1)
	{
		/* Read message from client */
		check = read(sock, buffer, 255);
		if (check < 0) {
			printf(">>ERROR on reading from socket!\n");
			exit(0);
		}
		printf(">>Here is the message: %s\n", buffer);

		/* Send message to client */
		check = write(sock, "I got your message!", 19);
		if (check < 0) {
			printf(">>ERROR on writing to socket!\n");
			exit(0);
		}
	}
}


//====================================================================
//MAIN FUNCTIONS
int main() {
    int sockfd;
	vector<int> newsockfd;
	socklen_t clilen;
    struct sockaddr_in servaddr, cliaddr;  
	marbleArray = randomArray();
	dupMarbleArray = marbleArray;
	int countclient = 0;

	/* Input the quantity of client */
	while (countclient<3 || countclient>9) {
		printf("Please input the quantity of client (>2 and <10): ");
		scanf("%d", &countclient);
	}
	
	//test
	for (int i=0; i<dupMarbleArray.size(); ++i) cout<<dupMarbleArray[i]<<endl;
	cout<<"SIZE: "<<dupMarbleArray.size()<<endl;

	/* Initial mutex */
	if (pthread_mutex_init(&lock, NULL) != 0)
    {
        printf(">>ERROR on initing mutex init!\n");
        exit(0);
    }

	/* First call to socket() function to create */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf(">>ERROR on opening socket!\n");
		exit(0);
	}

	/* Enable address reuse */
	int on = 1;
	setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));
	
	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *) &servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	servaddr.sin_port = htons(PORT);

	/* Now bind the host address using bind() call.*/
	if (bind(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		perror(">>ERROR on binding socket!\n");
		exit(0);
	}
      
	/* Now start listening for the clients, here
	  + process will go in sleep mode and will 
	  + wait for the incoming connection
	*/
	/* The backlog argument in "listen" specifies the maximum number of queued connections 
	  + and should be at least 0; the maximum value is system-dependent (usually 5), 
	  + the minimum value is forced to 0.
	  Ref: https://stackoverflow.com/questions/36594400/what-is-backlog-in-tcp-connections
	*/
	listen(sockfd, 5);
	clilen = sizeof(cliaddr);
	
	/* Accept the quantity of client */
	while (countclient!=0) {
		int valofsock = accept(sockfd, (SA*)&cliaddr, &clilen);
		if (valofsock < 0) {
			printf(">>ERROR on accepting from server!\n");
			continue;
		}
		newsockfd.push_back(valofsock);
		countclient--;
	}

	/* Run all new socket by creating thread */
	int i=0;
	while (1)
	{
		for (; i<newsockfd.size(); ++i) {
			pthread_t threadid;
			if (pthread_create(&threadid, NULL, run, &newsockfd[i]) < 0) {
				printf(">>ERROR on creating thread from server!\n");
				exit(0);
			}		
			pthread_detach(threadid);
		}
	}

	pthread_mutex_destroy(&lock);
	return 0;
} 

