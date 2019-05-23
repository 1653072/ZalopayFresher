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

#define PORT 8080
#define SA struct sockaddr

//====================================================================
//DECLARE FUNCTIONS
void run(int sock, vector<int> &marbleArray);
void func_test(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
void run(int sock, vector<int> &marbleArray) {
	int check;
	char buffer[256];
	
	/* Read message from server */
	// bzero(buffer, 256);
	// check = read(sock, buffer, 255);
	// if (check < 0) {
	// 	printf(">>ERROR on reading from socket!\n");
	// 	exit(0);
	// }
	// printf("[FROM SERVER] %s\n", buffer);

	while(1) {
		write(sock, "RequestMarble", 13);

		int val;
		read(sock, &val, sizeof(val));
		val=ntohl(val);
		if (val==-1) break;
		else
		{
			cout<<"[FROM SERVER][Client 3] Received: "<<val<<endl;
			marbleArray.push_back(val);
		}
	}

	cout<<"[Cli 3]"<<marbleArray.size()<<endl;

	
	/* Get the number of marbles */
	// int marbleArrSize = -1;
	// read(sock, &marbleArrSize, sizeof(marbleArrSize));
	// marbleArrSize=ntohl(marbleArrSize);
	// printf("[FROM SERVER] Quantity of marbles: %d\n", marbleArrSize);
	
	// /* Request marble if server still has marbles */
	// if (marbleArrSize != -1) {
	// 	if (marbleArrSize!=0) {
	// 		write(sock, "RequestMarble", 13);
	// 	}
	// 	else break;	/* marbleArrSize == 0: Out of stock */
	// }

	// /* Get out of stock from server */
	// bzero(buffer, 256);
	// read(sock, buffer, 255);
	// if (strcmp(buffer,"OutOfStock") == 0) break;
	// else {
	// 	int val;
	// 	read(sock, &val, sizeof(val));
	// 	val=ntohl(val);
	// 	cout<<"[FROM SERVER] Received: "<<val<<endl;
	// 	marbleArray.push_back(val);
	// }
}

void func_test(int sock) {
	int check;
	char buffer[256];
	
	while (1)
	{
		/* Send message to server */
		printf("Please enter the message: ");
		bzero(buffer, 256);
		fgets(buffer, 255, stdin);
		check = write(sock, buffer, strlen(buffer));
		if (check < 0) {
			printf(">>ERROR on writing to socket!\n");
			exit(0);
		}

		/* Read message from server */
		bzero(buffer, 256);
		check = read(sock, buffer, 255);
		if (check < 0) {
			printf(">>ERROR on reading from socket!\n");
			exit(0);
		}
		printf(">>The message from server: %s\n", buffer);
	}
}


//====================================================================
//MAIN FUNCTIONS
int main() {
    int sockfd;
    struct sockaddr_in servaddr; 
	vector<int> marbleArray;

	/* First call to socket() function to create */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf(">>ERROR on opening socket!\n");
		exit(0);
	}

	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *)&servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	servaddr.sin_port = htons(PORT);

	/* Now connect the client socket to the server socket */
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		printf(">>ERROR on connecting to server socket!\n");
		exit(0);
	}

	run(sockfd, marbleArray);
    
    close(sockfd); 
	return 0;
} 











/*#define MAX 80
void func(int sockfd)
{
	char buff[MAX];
	int n;
	for (;;) {
		bzero(buff, sizeof(buff));
		printf("Enter the string : ");
		n = 0;
		while ((buff[n++] = getchar()) != '\n')
			;
		write(sockfd, buff, sizeof(buff));
		bzero(buff, sizeof(buff));
		read(sockfd, buff, sizeof(buff));
		printf("From Server : %s", buff);
		if ((strncmp(buff, "exit", 4)) == 0) {
			printf("Client Exit...\n");
			break;
		}
	}
}*/

