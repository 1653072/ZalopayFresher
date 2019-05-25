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
char playername[256];
char filename[256];


//====================================================================
//DECLARE FUNCTIONS
bool isValidPlayerName(string input);
void inputPlayerName();
long sumValueOfMarbleArray();
void writeFile();
void requestMarble(int sock);
void sendFileToServer(int sock);
void receiveRankingFromServer(int sock);
void run(int sock);


//====================================================================
//IMPLEMENT FUNCTIONS
bool isValidPlayerName(string input) {
	/* Player name is valid when:
	  + The length of string belongs to [1, 250]
	  + Do not be one of these commands:
	      > ClientRequestMarble
		  > ServerReceivedPlayerName
		  > ClientDontHaveMarble
		  > ClientReadyToSendFile
		  > ServerRequestDataOfFile
		  > ServerSendRankingFile 
	*/

	if (input.length() == 0) return false;

	if (input.length() > 250) 
	{
		printf("[UNVALID NAME] The length of name can not be bigger than 250!\n");
		return false;
	}

	if (input.compare("ClientRequestMarble") == 0 ) 
	{
		printf("[UNVALID NAME] Your name can not be `ClientRequestMarble`!\n");
		return false;
	}

	if (input.compare("ServerReceivedPlayerName") == 0 ) 
	{
		printf("[UNVALID NAME] Your name can not be `ServerReceivedPlayerName`!\n");
		return false;
	}

	if (input.compare("ClientDontHaveMarble") == 0)
	{
		printf("[UNVALID NAME] Your name can not be `ClientDontHaveMarble`!\n");
		return false;
	}

	if (input.compare("ClientReadyToSendFile") == 0)
	{
		printf("[UNVALID NAME] Your name can not be `ClientReadyToSendFile`!\n");
		return false;
	}

	if (input.compare("ServerRequestDataOfFile") == 0)
	{
		printf("[UNVALID NAME] Your name can not be `ServerRequestDataOfFile`!\n");
		return false;
	}

	if (input.compare("ServerSendRankingFile") == 0)
	{
		printf("[UNVALID NAME] Your name can not be `ServerSendRankingFile`!\n");
		return false;
	}

	return true;
}

void inputPlayerName() {
	string input;
	do 
	{
		/* Input name */
		printf("[NOTICE] Input your player name: ");
		fflush(stdin);
		getline(cin, input);
	}
	while (!isValidPlayerName(input));
	
	/* Remove all space */
	input.erase(remove_if(input.begin(), input.end(), ::isspace), input.end());

	/* Copy the value of string to playername variable */
	strcpy(playername, (input + '\0').c_str());

	/* Update filename for storing data */
	strcpy(filename, (input + ".txt\0").c_str());

	/* Player name after removing space */
	printf("[NOTICE] Your player name removed space: ");
	printf("%s\n", playername);
}

long sumValueOfMarbleArray() {
	long sum = 0;
	for (int i = 0; i < marbleArray.size(); ++i) 
	{
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
	for (int i = 0; i < marbleArray.size(); ++i) 
	{
		if (i != (marbleArray.size() - 1)) fprintf(fp, "%d\n", marbleArray[i]);
		else fprintf(fp, "%d", marbleArray[i]);
	}
	fclose(fp);
}

void requestMarble(int sock) {
	while (1) 
	{
		/* Send command "ClientRequestMarble" to server */
		write(sock, "ClientRequestMarble", 19);

		/* Receive value of marble from server.
		   If server runs out of marbles. Value will be -1 */
		int val;
		read(sock, &val, sizeof(val));
		val = ntohl(val);
		if (val == -1) break;
		else 
		{
			/* Push value received from server */
			marbleArray.push_back(val);
			/* Sort ascending marbleArray */
			sort(marbleArray.begin(), marbleArray.end());
			/* Store data to file */
			writeFile();
		}
	}

	printf("[NOTICE] Your game has started and you got your marbles!\n");
	if (marbleArray.size() != 0) printf("[NOTICE] Writing marbles information to file completely!\n");
	printf("[NOTICE] Total marbles: %lu | Total score: %ld\n", marbleArray.size(), sumValueOfMarbleArray());

	//Comparison between qsort (C) and sort (C++)
	//https://www.geeksforgeeks.org/c-qsort-vs-c-sort/
}

void sendFileToServer(int sock) {
	/* Send player name to server */
	while (1) 
	{
		int check = write(sock, playername, strlen(playername));
		if (check > -1) break;
	}

	/* Receive command "ServerReceivedPlayerName" from server. After that,
	   client send command "ClientReadyToSendFile" (if file can be opened) 
	   or "ClientDontHaveMarble" (if file can NOT be opened) */
	FILE *fp;
	fp = fopen(filename, "r");

	char comBuf[256];
	bzero(comBuf, 256);
	while (1) 
	{
		read(sock, comBuf, sizeof(comBuf) - 1);
		if (strcmp(comBuf, "ServerReceivedPlayerName") == 0)
		{
			if (!fp)
			{	
				/* Client send command "ClientDontHaveMarble" to server */
				while (1) 
				{
					int check = write(sock, "ClientDontHaveMarble", 20);
					if (check > 0) break;
				}
				fclose(fp);
				return;
			}
			else
			{
				/* Client send command "ClientReadyToSendFile" to server */
				while (1)
				{
					int check = write(sock, "ClientReadyToSendFile", 21);
					if (check > 0) break;
				}
				break;
			}
		}
	}

	/* Send data of file to server */
	int nread = -1;
	while (1) 
	{
		/* Receive command "ServerRequestDataOfFile" from server */
		bzero(comBuf, 256);
		read(sock, comBuf, 255);
		if (strcmp(comBuf, "ServerRequestDataOfFile") == 0)
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

	printf("[NOTICE] Sending marble file to server successfully!\n");
}

void receiveRankingFromServer(int sock) {
	/* Receive command "ServerSendRankingFile" from server */
	char comBuf[256];
	bzero(comBuf, 256);
	while (1) 
	{
		read(sock, comBuf, sizeof(comBuf)-1);
		if (strcmp(comBuf, "ServerSendRankingFile") == 0) break;
	}

	/* Receive file ranking from server */
	char rankingfile[256];
	bzero(rankingfile, 256);
	strcpy(rankingfile, playername);
	strcat(rankingfile, "_ranking.txt\0");

	FILE *fp;
	fp = fopen(rankingfile, "w+");

	int bytesReceived = 0;
	char buff[1024];
	bzero(buff, 1024);
	while ((bytesReceived = read(sock, buff, 1024)) > 0) 
	{
		fwrite(buff, 1, bytesReceived, fp);
		bzero(buff, 1024);
	}

	fclose(fp);

	/* Open file again & print result */
	FILE *f;
	f = fopen(rankingfile, "r");

	printf("\n===================\n");
	printf(">>>RANKING BOARD<<<\n");
	printf("===================\n\n");
	printf("STT\t Name\t\t\t Score\n");
	char getbuf[256];
	while (!feof(f)) 
	{
		bzero(getbuf, 256);
		fgets(getbuf, 256, f);
		printf("%s\n", getbuf);
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
	if (sockfd < 0) 
	{
		printf("[ERROR] Opening socket fail. Exit program!\n");
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
	if (connect(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) 
	{
		printf("[ERROR] Connecting to server fail. Exit program!\n");
		exit(0);
	}
	else printf("[NOTICE] Connecting to server successfully. Please wait until enough clients join the game...\n");

	/* Run program */
	run(sockfd);
    
	/* Close socket */
    close(sockfd); 
	return 0;
} 

