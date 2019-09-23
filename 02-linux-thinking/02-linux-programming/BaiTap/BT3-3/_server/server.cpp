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
//STRUCTS
struct player {
	char playername[256];
	int result;
};


//====================================================================
//GLOBAL VARIABLES
vector<int> marbleArray;
pthread_mutex_t lock;
int countclient = 0;
vector<player> players;


//====================================================================
//DECLARE FUNCTIONS
vector<int> randomArray();
int sumValueOfArray(vector<int> arr);
void sendValueOfMarble(int sock);
void receiveFileFromClient(int sock);
void *run(void *argsock);
void sortRanking();
void sendRankingFileToClient(vector<int> newsockfd);
void closeAllSocket(vector<int> newsockfd);


//====================================================================
//IMPLEMENT FUNCTIONS
vector<int> randomArray() {
	srand(time(NULL));

	/* Formula: rand() % (MAX + 1 - MIN ) + MIN */
	/* Value of array size belongs to [101, 999] */
	int arrsize = rand()%899 + 101; 
	vector<int> newarr;

	/* The value received from randomization belongs to [1, 1000] */
	for (int i=0; i<arrsize; ++i) 
	{
		newarr.push_back(rand() % 1000 + 1); 
	}

	return newarr;
}

int sumValueOfArray(vector<int> arr) {
	int sum = 0;
	for (int i = 0; i < arr.size(); ++i) 
	{
		sum += arr[i];
	}
	return sum;
}

void sendValueOfMarble(int sock) {
	char buffer[256];
	int val = -2;

	while (val != -1) 
	{
		/* Receive command "ClientRequestMarble" from client */
		bzero(buffer, 256);
		read(sock, buffer, 255);
		if (strcmp(buffer, "ClientRequestMarble") == 0)
		{
			pthread_mutex_lock(&lock);
			if (marbleArray.size() != 0)
			{
				/* Send first value of marble array to client */
				val = htonl(marbleArray[0]);
				marbleArray.erase(marbleArray.begin());
			}
			else
			{
				/* Send -1 (server runs out of marbles) and Quit sending marbles */
				val = htonl(-1);
			}
			write(sock, &val, sizeof(val));
			pthread_mutex_unlock(&lock);
		}
	}
}

void receiveFileFromClient(int sock) {
	/* Receive player name from client. After that, server
	   sends command "ServerReceivedPlayerName" to client */
	char playername[256];
	bzero(playername, 256);
	while (read(sock, playername, sizeof(playername)-1) > 0) 
	{
		write(sock, "ServerReceivedPlayerName", 24);
		break;
	}

	/* Receive command "ClientDontHaveMarble" or "ClientReadyToSendFile" from client */
	char comBuf[256];
	bzero(comBuf, 256);
	while (read(sock, comBuf, sizeof(comBuf) - 1) > 0)
	{
		/* Command "ClientDontHaveMarble" */
		if (strcmp(comBuf, "ClientDontHaveMarble") == 0)
		{
			player var;
			strcpy(var.playername, playername);
			var.result = 0;

			players.push_back(var);
			return;
		}

		/* Command "ClientReadyToSendFile" */
		if (strcmp(comBuf, "ClientReadyToSendFile") == 0) break;
	}

	/* Write content (by bytes) to file */
	char filename[256];
	bzero(filename, 256);
	strcpy(filename, playername);
	strcat(filename, ".txt\0");

	FILE *fp;
	fp = fopen(filename, "w+");

	int bytesReceived = 0;
	char buff[1024];
	while (1) 
	{
		/* Send command "ServerRequestDataOfFile" to client */
		write(sock, "ServerRequestDataOfFile", 23);

		/* Receive data of file from client */
		bytesReceived = read(sock, buff, 1024);
		if (strcmp(buff, "-1") == 0) break; //END OF FILE => break
		fwrite(buff, 1, bytesReceived, fp);
		bzero(buff, 1024);
	}

	fclose(fp);

	/* Open file again & load value of marbles to array for computing the total */
	FILE *f;
	f = fopen(filename, "r");

	vector<int> marbleOfClient;
	int val;
	while (!feof(f)) 
	{
		fscanf(f, "%d", &val);		
		marbleOfClient.push_back(val);
	}

	fclose(f);

	/* Sum value of marbleOfClient */
	int sum = sumValueOfArray(marbleOfClient);

	/* Server store result of client */
	player var;
	strcpy(var.playername, playername);
	var.result = sum;

	players.push_back(var);
}

void *run(void *argsock) {
	/* Get the socket descriptor */
	int sock = *((int *) argsock);
	
	/* Send marble to client when they request */
	sendValueOfMarble(sock);

	/* Receive file from client */
	receiveFileFromClient(sock);

	/* Close thread */
	pthread_exit(NULL); 
}

void sortRanking() {
	/* Sort ranking by interchange sort*/
	for (int i=0; i<players.size()-1; ++i) 
	{
		for (int j=i+1; j<players.size(); ++j) 
		{
			if (players[i].result < players[j].result)
				swap(players[i], players[j]);
		}
	}

	/* Store data to file "ranking.txt" */
	FILE *fp;
	fp = fopen("ranking.txt", "w+");

	for (int i = 0; i < players.size(); ++i) 
	{
		if (i != (players.size() - 1)) 
		{
			fprintf(fp, "%d.\t %s \t\t\t %d\n", i+1, players[i].playername, players[i].result);
		}
		else
		{
			fprintf(fp, "%d.\t %s \t\t\t %d", i+1, players[i].playername, players[i].result);
		}
	}

	fclose(fp);
}

void sendRankingFileToClient(vector<int> newsockfd) {
	for (int i=0; i< newsockfd.size(); ++i) 
	{
		/* Send command "ServerSendRankingFile" to client */
		while (1) 
		{
			int check = write(newsockfd[i], "ServerSendRankingFile", 21);
			if (check > 0) break;
		}

		/* Send data of "ranking.txt" to client */
		FILE *fp;
		fp = fopen("ranking.txt", "r");
		while (1) 
		{
			unsigned char buff[1024];
			bzero(buff, 1024);
			int nread = fread(buff, 1, 1024, fp);
			if (nread > 0) write(newsockfd[i], buff, nread);
			if (nread < 1024) break;
		}
		fclose(fp);

		usleep(5000); //0.5s
	}
}

void closeAllSocket(vector<int> newsockfd) {
	for (int i=0; i<newsockfd.size(); ++i) 
	{
		close(newsockfd[i]);
	}
}


//====================================================================
//MAIN FUNCTIONS
int main() {
	int sockfd;
	vector<int> newsockfd;
	socklen_t clilen;
	struct sockaddr_in servaddr, cliaddr;  

	/* Randomizing value of array for marbleArray */
	marbleArray = randomArray();

	/* Print size of marbleArray and sum all its values */
	printf("----------------------------------------\n");
	printf("[NOTICE] SIZE marble array: %lu\n", marbleArray.size());
	printf("[NOTICE] SUM marble array: %d\n", sumValueOfArray(marbleArray));
	printf("----------------------------------------\n");

	/* Input the quantity of client */
	while (countclient<3 || countclient>9) 
	{
		printf("[NOTICE] Please input the quantity of client (>2 and <10): ");
		scanf("%d", &countclient);
	}

	/* Initialize mutex */
	if (pthread_mutex_init(&lock, NULL) != 0)
    {
        printf("[ERROR] Creating mutex fail. Exit program!\n");
        exit(0);
    }

	/* Call to socket() function to create socket */
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0) 
	{
		printf("[ERROR] Opening socket fail. Exit program!\n");
		exit(0);
	}

	/* Enable reuse address. Why to use? See link below:
	   https://stackoverflow.com/questions/14388706/socket-options-so-reuseaddr-and-so-reuseport-how-do-they-differ-do-they-mean-t */
	int on = 1;
	setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));
	
	/* Initialize socket structure (assign IP, PORT) */
	bzero((char *) &servaddr, sizeof(servaddr));
	servaddr.sin_family = AF_INET;
	servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");
	servaddr.sin_port = htons(PORT);

	/* Bind the host address by using bind() function */
	if (bind(sockfd, (SA*)&servaddr, sizeof(servaddr)) < 0) 
	{
		printf("[ERROR] Binding socket fail. Exit program!\n");
		exit(0);
	}
      
	/* Start listening for the clients, 
	  + here process will go in sleep mode and  
	  + will wait for the incoming connection
	*/
	/* The backlog argument in "listen" specifies the maximum number of client connections 
	  + that server will queue for this listening socket. Here is 9.
	*/
	listen(sockfd, 9);
	clilen = sizeof(cliaddr);
	
	/* Accept the quantity of client */
	int counttemp = countclient;
	printf("[NOTICE] Waiting %d clients connecting...\n", counttemp);
	while (counttemp!=0) 
	{
		int valofsock = accept(sockfd, (SA*)&cliaddr, &clilen);
		if (valofsock < 0) 
		{
			printf("[ERROR] Accepting client fail. Reloading...!\n");
			continue;
		}
		printf("[NOTICE] Client %d connected!\n", countclient - counttemp + 1);
		newsockfd.push_back(valofsock);
		counttemp--;
	}

	/* Run all new sockets by creating thread. After creating thread based on value of newsockfd array,
	  + "run" function can be executed due to while(1) and this time, do not create more thread.*/
	int i=0;
	while (1)
	{
		if (players.size() == countclient) break;
		for (; i<newsockfd.size(); ++i) 
		{
			pthread_t threadid;
			if (pthread_create(&threadid, NULL, run, &newsockfd[i]) < 0) 
			{
				printf("[ERROR] Creating thread from server fail. Exit program!\n");
				exit(0);
			}		
			pthread_detach(threadid);
			if (i == (newsockfd.size() - 1)) printf("[NOTICE] Server starts the game!\n");
		}
	}

	/* Server sort ranking, send ranking file to client and end game */
	printf("[NOTICE] Server sends the ranking board!\n");
	sortRanking();
	sendRankingFileToClient(newsockfd);
	closeAllSocket(newsockfd);
	printf("[NOTICE] Server ends the game!\n");

	pthread_mutex_destroy(&lock);
	return 0;
} 

