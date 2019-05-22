#include <stdio.h> 
#include <stdlib.h>
#include <string.h> 
#include <netdb.h> 
#include <netinet/in.h>
#include <sys/socket.h> 
#include <sys/types.h> 

#define PORT 8080 
#define SA struct sockaddr 

//====================================================================
//DECLARE FUNCTIONS
void func_test(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
void func_test(int sock) {
	int check;
	char buffer[256];
	bzero(buffer, 256);

	/* Read message from client */
	check = read(sock, buffer, 255);
	if (check < 0) {
		printf(">>ERROR on reading from socket!\n");
		exit(0);
	}
	printf(">>Here is the message: %s\n", buffer);

	/* Send message to client */
	check = write(sock, ">>I got your message!", 21);
	if (check < 0) {
		printf(">>ERROR on writing to socket!\n");
		exit(0);
	}
}


//====================================================================
//MAIN FUNCTIONS
int main(int argc, char *argv[]) {
    int sockfd, newsockfd, clilen;
    struct sockaddr_in servaddr, cliaddr; 
    pid_t childpid; 
  
	/* First call to socket() function to create */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf(">>ERROR on opening socket!\n");
		exit(0);
	}
	
	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *) &servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = htonl(INADDR_ANY);
	servaddr.sin_port = htons(PORT);

	/* Now bind the host address using bind() call.*/
	if (bind(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		printf(">>ERROR on binding socket!\n");
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

	while (1) {
		newsockfd = accept(sockfd, (SA*)&cliaddr, &clilen);
		if (newsockfd < 0) {
			printf(">>ERROR on accepting from server!\n");
			exit(0);
		}

		/* Create child process */
		childpid = fork();
		if (childpid < 0) {
			printf(">>ERROR on forking!\n");
			exit(0);
		}

		if (childpid == 0) {
			/* This is the client process */
			close(sockfd);
			//---------------------------------
			//DoSomethingHere(newsockfd)
			func_test(newsockfd);
			//---------------------------------
			exit(0);
		}
		else close(newsockfd);
	} 
} 










// Function designed for chat between client and server. 
/*
#define MAX 80
void func(int sockfd)
{
	char buff[MAX];
	int n;
	// infinite loop for chat 
	for (;;) {
		bzero(buff, MAX);

		// read the message from client and copy it in buffer 
		read(sockfd, buff, sizeof(buff));
		// print buffer which contains the client contents 
		printf("From client: %s\t To client : ", buff);
		bzero(buff, MAX);
		n = 0;
		// copy server message in the buffer 
		while ((buff[n++] = getchar()) != '\n')
			;

		// and send that buffer to client 
		write(sockfd, buff, sizeof(buff));

		// if msg contains "Exit" then server exit and chat ended. 
		if (strncmp("exit", buff, 4) == 0) {
			printf("Server Exit...\n");
			break;
		}
	}
}*/

