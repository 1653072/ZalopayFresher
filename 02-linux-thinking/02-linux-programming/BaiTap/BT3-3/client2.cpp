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
//GLOBAL VARIABLES
vector<int> marbleArray;


//====================================================================
//DECLARE FUNCTIONS
long sumValueOfMarbleArray();
void requestMarble(int sock);
void writeFile();
void sendFileToServer(int sock);
void run(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
long sumValueOfMarbleArray() {
	long sum = 0;
	for (int i = 0; i < marbleArray.size(); ++i) {
		sum += marbleArray[i];
	}
	return sum;
}

void requestMarble(int sock) {
	printf("[NOTICE] Let 's start the game!\n");

	while (1) {
		/* Send command "RequestMarble" to server */
		write(sock, "RequestMarble", 13);

		/* Receive value of marble from server.
		   If server runs out of marbles. Value will be -1 */
		int val;
		read(sock, &val, sizeof(val));
		val = ntohl(val);
		if (val == -1) break;
		else marbleArray.push_back(val);
	}

	printf("[NOTICE] You got your marbles | Total marbles: %d | Total score: %d\n", marbleArray.size(), sumValueOfMarbleArray());
}

void writeFile() {
	/* Check size of marbleArray to decide to create file or not */
	if (marbleArray.size() == 0)
	{
		printf("[NOTICE] You don't have any marbles for WRITING file. So sad!\n");
		return;
	}

	/* Store data of marbleArray to file */
	FILE *fp;
	fp = fopen("client2.txt", "w+");
	for (int i = 0; i < marbleArray.size(); ++i) {
		if (i != (marbleArray.size() - 1)) fprintf(fp, "%d\n", marbleArray[i]);
		else fprintf(fp, "%d", marbleArray[i]);
	}
	fclose(fp);
	printf("[NOTICE] Writing marbles information to file successfully!\n");
}

void sendFileToServer(int sock) {
	FILE *fp;
	fp = fopen("client2.txt", "r");

	/* Check file exists or not */
	if (!fp)
	{
		printf("[NOTICE] File not found or you don't have any marbles for SENDING to server!\n");
		return;
	}

	/* Send name of file to server */
	write(sock, "client2.txt", 10;)

		/* Send data of file to server */
		int val;
	while (!feof(fp)) {
		fscanf(pFile, "%d", &val);
		val = htonl(val);
		write(sock, &val, sizeof(val));
	}

	fclose(fp);
	printf("[NOTICE] Sending file of marbles to server successfully!\n");
}

void run(int sock) {
	/* Request marble to server and Receive marble from server */
	requestMarble(sock);
	/* Save value of all marbles to file */
	writeFile();
	/* Send file to server */
	sendFileToServer(sock);
}


//====================================================================
//MAIN FUNCTIONS
int main() {
	int sockfd;
	struct sockaddr_in servaddr;

	/* First call to socket() function to create */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) {
		printf("[ERROR] Opening socket fail!\n");
		exit(0);
	}

	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *)&servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	servaddr.sin_port = htons(PORT);

	/* Now connect the client socket to the server socket */
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		printf("[ERROR] Connecting to server fail!\n");
		exit(0);
	}
	else printf("[NOTICE] Connecting to server successfully. Please wait until enough clients join the game!\n");

	/* Run program */
	run(sockfd);

	/* Close socket */
	close(sockfd);
	return 0;
}

