#include <iostream>
using namespace std;
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h> 
#include <string.h> 
#include <vector>
#include <bits/stdc++.h>  //Lib used for sorting vector in C++
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
string playername;
char filename[256];


//====================================================================
//DECLARE FUNCTIONS
bool isValidPlayerName();
void inputPlayerName();
long sumValueOfMarbleArray();
void writeFile();
void requestMarble(int sock);
void sendFileToServer(int sock);
void receiveRankingFromServer(int sock);
void run(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
bool isValidPlayerName() {
	if (playername.length() == 0) return false;

	if (playername.length() > 250) {
		printf("[UNVALID NAME] The length of name can not be bigger than 250!\n");
		return false;
	}

	if (playername.compare("RequestMarble") == 0 ) {
		printf("[UNVALID NAME] Your name can not be `RequestMarble`!\n");
		return false;
	}

	if (playername.compare("FileNotFound") == 0 ) {
		printf("[UNVALID NAME] Your name can not be `FileNotFound`!\n");
		return false;
	}

	return true;
}

void inputPlayerName() {
	do {
		/* Input name */
		printf("[NOTICE] Input your player name: ");
		fflush(stdin);
		getline(cin, playername);
	}
	while (!isValidPlayerName());
	
	/* Remove all space */
	playername.erase(remove_if(playername.begin(), playername.end(), ::isspace), playername.end());

	/* Add '\0' to end of playername string */
	playername += '\0';

	/* Name after removing space */
	printf("[NOTICE] Your player name removed space: ");
	printf("%s\n", playername.c_str());

	/* Update filename for storing data.
	   Convert string to char[256] */
	strcpy(filename, (playername + ".txt\0").c_str());
}

long sumValueOfMarbleArray() {
	long sum = 0;
	for (int i = 0; i < marbleArray.size(); ++i) {
		sum += marbleArray[i];
	}
	return sum;
}

void writeFile() {
	/* Check size of marbleArray */
	if (marbleArray.size() == 0) return;

	/* Store data of marbleArray to file */
	FILE *fp;
	fp = fopen(filename, "w+");
	for (int i = 0; i < marbleArray.size(); ++i) {
		if (i != (marbleArray.size() - 1)) fprintf(fp, "%d\n", marbleArray[i]);
		else fprintf(fp, "%d", marbleArray[i]);
	}
	fclose(fp);
}

void requestMarble(int sock) {
	while (1) {
		/* Send command "RequestMarble" to server */
		write(sock, "RequestMarble", 13);

		/* Receive value of marble from server.
		   If server runs out of marbles. Value will be -1 */
		int val;
		read(sock, &val, sizeof(val));
		val = ntohl(val);
		if (val == -1) break;
		else {
			/* Push value received from server */
			marbleArray.push_back(val);
			/* Sort ascending marbleArray */
			sort(marbleArray.begin(), marbleArray.end());
			/* Store data to file */
			writeFile();
		}
	}

	printf("[NOTICE] Server ran out of marbles!\n");
	printf("[NOTICE] Writing marbles information to file completely!\n");
	printf("[NOTICE] You got your marbles | Total marbles: %lu | Total score: %ld\n", marbleArray.size(), sumValueOfMarbleArray());

	//Comparison between qsort (C) and sort (C++)
	//https://www.geeksforgeeks.org/c-qsort-vs-c-sort/
}

void sendFileToServer(int sock) {
	FILE *fp;
	fp = fopen(filename, "r");

	/* Check file exists or not. If not,
	   send command "FileNotFound" to server & 
	   stop sending file from client to server */
	if (!fp)
	{
		while (1) {
			int check = write(sock, "FileNotFound", 12);
			if (check > 0) break;
		}
		printf("[NOTICE] File not found or you don't have any marbles for SENDING to server!\n");
		fclose(fp);
		return;
	}

	/* Send player name to server */
	char tmp[256];
	bzero(tmp, 256);
	strcpy(tmp, playername.c_str());
	while (1) {
		int check =	write(sock, tmp, strlen(tmp));
		if (check > -1 ) break;
	}

	/* Wait until receive command "ServerReceivedPlayerName" from server */
	bzero(tmp, 256);
	while (1) {
		read(sock, tmp, sizeof(tmp)-1);
		if (strcmp(tmp, "ServerReceivedPlayerName") == 0) break;
	}

	/* Send data of file to server */
	fp = fopen(filename, "r");
	int nread = -1;
	while (1) {
		/* Receive command "RequestDataOfFile" from server */
		bzero(tmp, 256);
		read(sock, tmp, 255);
		if (strcmp(tmp, "RequestDataOfFile") == 0)
		{	
			/* Send -1 to server => End file */
			if (nread>0 && nread<1024) 
			{
				write(sock, "-1", 2);
				break;
			}
			/* Send data to server */
			else 
			{
				unsigned char buff[1024];
				bzero(buff, 1024);
				nread = fread(buff, 1, 1024, fp);
				if (nread > 0) write(sock, buff, nread);
			}
		}
	}
	fclose(fp);

	printf("[NOTICE] Sending file of marbles to server successfully!\n");
}

void receiveRankingFromServer(int sock) {
	/* Receive command "SendRankingFromServer" from server*/
	char tmp[256];
	bzero(tmp, 256);
	while (1) {
		read(sock, tmp, sizeof(tmp)-1);
		if (strcmp(tmp, "SendRankingFromServer") == 0) break;
	}

	/* Receive file ranking from server */
	char rankingfile[256];
	bzero(rankingfile, 256);
	strcpy(rankingfile, ("ranking_" + playername + ".txt").c_str());

	FILE *fp;
	fp = fopen(rankingfile, "w+");

	int bytesReceived = 0;
	char buff[1024];
	while ((bytesReceived = read(sock, buff, 1024)) > 0) {
		fwrite(buff, 1, bytesReceived, fp);
		bzero(buff, 1024);
	}

	fclose(fp);

	/* Open file again & print result */
	FILE *f;
	f = fopen(rankingfile, "r");
	
	printf("\nSTT\t Name\t Score\n");
	while (!feof(f)) {
		bzero(tmp, 256);
		fgets(tmp, 256, f);	
		printf("%s\n", tmp);
	}

	fclose(f);
}

void run(int sock) {
	/* Request marble to server and Receive marble from server.
	   After that, sort ascending marbleArray and write to file.*/
	requestMarble(sock);
	/* Send file to server */
	sendFileToServer(sock);
	/* Receive ranking from server */
	receiveRankingFromServer(sock);
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

	/* Input player name before starting the game */
	inputPlayerName();

	/* Now connect the client socket to the server socket */
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) {
		printf("[ERROR] Connecting to server fail!\n");
		exit(0);
	}
	else printf("[NOTICE] Connecting to server successfully. Please wait until enough clients join the game...\n");

	/* Run program */
	run(sockfd);
    
	/* Close socket */
    close(sockfd); 
	return 0;
} 

