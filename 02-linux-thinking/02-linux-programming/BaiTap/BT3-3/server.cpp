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
vector<int> marbleArray;
pthread_mutex_t lock;


//====================================================================
//DECLARE FUNCTIONS
vector<int> randomArray();
void sendMarble(int sock);
void *run(void *argsock);


//====================================================================
//IMPLEMENT FUNCTIONS
vector<int> randomArray() {
	srand(time(NULL));

	//Value of array size belongs to [101, 999]
	int arrsize = rand()%898 + 101; 
	vector<int> newarr;

	//The value received from randomization belongs to [1, 1000]
	for (int i=0; i<arrsize; ++i) {
		newarr.push_back(rand() % 1000) + 1; 
	}

	return newarr;
}

void sendValueOfMarble(int sock) {
	char buffer[256];
	bool stop = false;

	while (!stop) {
		/* Receive command "RequestMarble" from client */
		bzero(buffer, 256);
		read(sock, buffer, 255);
		if (strcmp(buffer, "RequestMarble") == 0)
		{
			/* Send first value of marble array to client */
			pthread_mutex_lock(&lock);
			if (marbleArray.size() != 0)
			{
				int val = htonl(marbleArray[0]);
				marbleArray.erase(marbleArray.begin());
				write(sock, &val, sizeof(val));
			}
			/* Send -1 (server runs out of marbles) and Quit sending marbles */
			else
			{
				int val = htonl(-1);
				write(sock, &val, sizeof(val));
				stop = true;
			}
			pthread_mutex_unlock(&lock);
		}
	}
}

void *run(void *argsock) {
	/* Get the socket descriptor */
	int sock = *((int *) argsock);
	
	/* Send marble to client when they request */
	sendValueOfMarble(sock);

	//GetNameOfFile from Client
	//Compute the result

	/* Close socket & thread */
    close(sock);
    pthread_exit(NULL); 
}


//====================================================================
//MAIN FUNCTIONS
int main() {
    int sockfd;
	int countclient = 0;
	vector<int> newsockfd;
	socklen_t clilen;
    struct sockaddr_in servaddr, cliaddr;  

	/* Randomizing value of array for marbleArray */
	marbleArray = randomArray();

	/* Input the quantity of client */
	while (countclient<3 || countclient>9) {
		printf("[NOTICE] Please input the quantity of client (>2 and <10): ");
		scanf("%d", &countclient);
	}

	/* Initialize mutex */
	if (pthread_mutex_init(&lock, NULL) != 0)
    {
        printf("[ERROR] Creating mutex fail!\n");
        exit(0);
    }

	/* Call to socket() function to create socket */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf("[ERROR] Opening socket fail!\n");
		exit(0);
	}

	/* Enable reuse address */
	int on = 1;
	setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));
	
	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *) &servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	servaddr.sin_port = htons(PORT);

	/* Bind the host address by using bind() function */
	if (bind(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		perror("[ERROR] Binding socket fail!\n");
		exit(0);
	}
      
	/* Start listening for the clients, 
	  + here process will go in sleep mode and  
	  + will wait for the incoming connection
	*/
	/* The backlog argument in "listen" specifies the maximum number of queued connections 
	  + and should be at least 0; the maximum value is system-dependent (usually 5), 
	  + the minimum value is forced to 0.
	  + Ref: https://stackoverflow.com/questions/36594400/what-is-backlog-in-tcp-connections
	*/
	listen(sockfd, 5);
	clilen = sizeof(cliaddr);
	
	/* Accept the quantity of client */
	while (countclient!=0) {
		int valofsock = accept(sockfd, (SA*)&cliaddr, &clilen);
		if (valofsock < 0) {
			printf("[ERROR] Accepting from server fail!\n");
			continue;
		}
		newsockfd.push_back(valofsock);
		countclient--;
	}

	/* Run all new sockets by creating thread. After creating thread based on value of newsockfd array,
	  + "run" function can be executed due to while(1) and this time, do not create more thread.*/
	int i=0;
	while (1)
	{
		for (; i<newsockfd.size(); ++i) {
			pthread_t threadid;
			if (pthread_create(&threadid, NULL, run, &newsockfd[i]) < 0) {
				printf("[ERROR] Creating thread from server fail!\n");
				exit(0);
			}		
			pthread_detach(threadid);
		}
	}

	pthread_mutex_destroy(&lock);
	return 0;
} 

