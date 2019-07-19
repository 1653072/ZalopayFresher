from abc import ABC, abstractmethod

class DB_Abstract(ABC):
    @abstractmethod
    def connectToDB(self):
        pass

    @abstractmethod
    def closeConnectToDB(self):
        pass

    @abstractmethod
    def checkLoginAccount(self):
        pass

    @abstractmethod
    def updateOnlineStatus(self):
        pass

    @abstractmethod
    def updateOfflineStatus(self):
        pass

    @abstractmethod
    def getActiveList(self):
        pass
        
    @abstractmethod
    def getAccountInfo(self):
        pass

    @abstractmethod
    def isAvailableUsername(self):
        pass

    @abstractmethod
    def createNewAccount(self):
        pass
        
    @abstractmethod
    def activateAccount(self):
        pass

    @abstractmethod
    def deactiveAccount(self):
        pass

    @abstractmethod
    def updatePhone(self):
        pass
        
    @abstractmethod
    def updateEmail(self):
        pass

    @abstractmethod
    def updatePassword(self):
        pass
    
    @abstractmethod
    def updateUpdateAt(self):
        pass
        
    @abstractmethod
    def createNewChatRoom(self):
        pass

    @abstractmethod
    def isGroupMember(self):
        pass
    
    @abstractmethod
    def addMemberToChatGroup(self):
        pass
        
    @abstractmethod
    def createNewChatGroup(self):
        pass
    
    @abstractmethod
    def checkNameOfMyGroupList(self):
        pass
        
    @abstractmethod
    def updateSeenMessage(self):
        pass

    @abstractmethod
    def updateUnseenMessage(self):
        pass
    
    @abstractmethod
    def updateRoomName(self):
        pass
        
    @abstractmethod
    def getRoomOfFriends(self):
        pass

    @abstractmethod
    def getMyGroups(self):
        pass
    
    @abstractmethod
    def getRoomName(self):
        pass
        
    @abstractmethod
    def getRoomType(self):
        pass

    @abstractmethod
    def getPartInfo(self):
        pass
    
    @abstractmethod
    def getAllPartsInfo(self):
        pass
        
    @abstractmethod
    def findFriendsInMyGroup(self):
        pass

    @abstractmethod
    def findFriendInMyRoom(self):
        pass
    
    @abstractmethod
    def plus1TotalMessage(self):
        pass
        
    @abstractmethod
    def sumAllMsgInGroup(self):
        pass

    @abstractmethod
    def checkMsgIsSeenInGroup(self):
        pass

    @abstractmethod
    def leaveGroup(self):
        pass
        
    @abstractmethod
    def deleteGroup(self):
        pass

    @abstractmethod
    def getFriendList(self):
        pass

    @abstractmethod
    def getFriendRequestList(self):
        pass
        
    @abstractmethod
    def isFriendEachOther(self):
        pass

    @abstractmethod
    def requestFriend(self):
        pass

    @abstractmethod
    def cancelFriendRequest(self):
        pass
        
    @abstractmethod
    def acceptFriendRequest(self):
        pass

    @abstractmethod
    def unfriend(self):
        pass

    @abstractmethod
    def getAllMessages(self):
        pass
        
    @abstractmethod
    def saveMessage(self):
        pass

    @abstractmethod
    def getNewestMsgInfoOfGroup(self):
        pass