#include <stdio.h> 
#include <stdlib.h>
#include <string.h> 
#include <netdb.h> 
#include <netinet/in.h>
#include <sys/socket.h> 
#include <sys/types.h> 
 
#define SA struct sockaddr

//====================================================================
//DECLARE FUNCTIONS
void func_test(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
void func_test(int sock) {
	int check;
	char buffer[256];
	
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


//====================================================================
//MAIN FUNCTIONS
int main(int argc, char *argv[]) {
    int sockfd, PORT;
    struct sockaddr_in servaddr; 
	struct hostent *server;
  
	/* Check number of arguments & get value from arguments */
	if (argc != 3) {
		printf(">>Usage: ./client <IP Address> <PORT>\n");
		exit(0);
	}
	server = gethostbyname(argv[1]);
	PORT = atoi(argv[2])

	/* First call to socket() function to create */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf(">>ERROR on opening socket!\n");
		exit(0);
	}

	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *)&servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	bcopy((char *)server->h_addr, (char *)&servaddr.sin_addr.s_addr, server->h_length);
	servaddr.sin_port = htons(PORT);

	/* Now connect the client socket to the server socket */
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		printf(">>ERROR on connecting to server socket!\n");
		exit(0);
	}

	//---------------------------------
	//DoSomethingHere(sockfd)
	func_test(sockfd);
	//---------------------------------
    
    close(sockfd); 
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

