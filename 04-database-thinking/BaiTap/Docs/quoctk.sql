CREATE DATABASE IF NOT EXISTS `ChatDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ChatDB`;

CREATE TABLE Accounts (username varchar(30) NOT NULL, password varchar(255) NOT NULL, email varchar(50) NOT NULL, phone int(10) NOT NULL, status tinyint(1) DEFAULT 0 NOT NULL, createAt datetime NOT NULL, updateAt datetime NOT NULL, PRIMARY KEY (username)) ENGINE=InnoDB;
CREATE TABLE Friends (username varchar(30) NOT NULL, friendUsername varchar(30) NOT NULL, status tinyint(1) DEFAULT 0 NOT NULL, PRIMARY KEY (username, friendUsername)) ENGINE=InnoDB;
CREATE TABLE ChatRooms (roomID bigint(20) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, roomType tinyint(1) DEFAULT 0 NOT NULL, PRIMARY KEY (roomID)) ENGINE=InnoDB;
CREATE TABLE Participants (username varchar(30) NOT NULL, roomID bigint(20) NOT NULL, status tinyint(1) DEFAULT 0 NOT NULL, totalMessages bigint(20) DEFAULT 0 NOT NULL, PRIMARY KEY (username, roomID)) ENGINE=InnoDB;
CREATE TABLE Messages (roomID bigint(20) NOT NULL, messageID int(10) NOT NULL AUTO_INCREMENT, authorID varchar(30) NOT NULL, content text NOT NULL, createAt datetime NOT NULL, PRIMARY KEY (messageID)) ENGINE=InnoDB;
ALTER TABLE Friends ADD CONSTRAINT FKFriends450382 FOREIGN KEY (friendUsername) REFERENCES Accounts (username);
ALTER TABLE Friends ADD CONSTRAINT FKFriends371740 FOREIGN KEY (username) REFERENCES Accounts (username);
ALTER TABLE Participants ADD CONSTRAINT FKParticipan355338 FOREIGN KEY (username) REFERENCES Accounts (username);
ALTER TABLE Participants ADD CONSTRAINT FKParticipan110122 FOREIGN KEY (roomID) REFERENCES ChatRooms (roomID);
ALTER TABLE Messages ADD CONSTRAINT FKMessages834763 FOREIGN KEY (roomID) REFERENCES ChatRooms (roomID);
ALTER TABLE Messages ADD CONSTRAINT FKMessages594280 FOREIGN KEY (authorID) REFERENCES Accounts (username);

