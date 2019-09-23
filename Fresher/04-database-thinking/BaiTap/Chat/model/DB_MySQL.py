# Import libs
from DB_Abstract import *
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode
import bcrypt
from datetime import datetime
from enum import Enum


# Khai báo config của DB
config = {
    'host': '127.0.0.1',
    'database': 'ChatDB',
    'user': 'root',     
    'password': 'Kienquoc123',
    'autocommit': True
}


# Định nghĩa status bạn bè của nhau
# Default: REQUEST FRIEND (0)
class FriendStatus(Enum):
    REQUESTFRIEND = 0
    ISFRIEND = 1


# Định nghĩa các trạng thái (status) của 1 account:
# status = -1           => Deactive
# status = 0 (Default)  => Offline
# status = 1            => Online


# Định nghĩa loại Room:
# + roomType=0 (Default): Friend to Friend (Chat room)
# + roomType=1: Friend to Group (Chat group)


# Định nghĩa loại Status trong table Participants:
# + status=0 (Default): Unseen
# + status=1: Seen


# Các nguồn tham khảo:
# + https://pynative.com/python-mysql-database-connection/
# + https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html
# + https://stackoverflow.com/questions/7002429/how-can-i-extract-all-values-from-a-dictionary-in-python


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


class MYSQL(DB_Abstract):


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------CONNECTOR-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Hàm kết nối DB
    def connectToDB(self):
        connection = None
        try:
            connection = mysql.connector.connect(**config)
            if (connection.is_connected()):
                infoDB = connection.get_server_info()
                print("[NOTICE] MySQL Server has version on", infoDB)
                return connection
        except Error as e:
            print ("[ERROR]", e)
            return None
       
    # Hàm ngắt kết nối DB
    def closeConnectToDB(self, connection):
        if (connection.is_connected()):
            connection.close()
            print("[NOTICE] MySQL connection is closed")


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------ACCOUNT-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Hàm kiểm tra đăng nhập có hợp lệ => TRUE: hợp lệ, FALSE: không hợp lệ
    def checkLoginAccount(self, connection, username, password):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT password FROM Accounts WHERE username=%s;"
            cursor.execute(query, (username,))
            passHashed = cursor.fetchone()
            if (bcrypt.checkpw(password, passHashed[0])):
                cursor.close()
                return True

        return False

    # Cập nhật status từ Offline (0) thành Online (1) dựa trên username
    def updateOnlineStatus(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET status=1 WHERE username=%s;"
            cursor.execute(query, (username,))
            cursor.close()

    # Cập nhật status từ Online (1) thành Offline (0) dựa trên username
    def updateOfflineStatus(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET status=0 WHERE username=%s;"
            cursor.execute(query, (username,))
            cursor.close()

    # Lấy status (Online/Active) từ danh sách bạn bè cho sẵn
    def getActiveList(self, connection, userArray):
        cursor = connection.cursor()
        if (cursor != None):
            result = []
            for ele in userArray:
                query = "SELECT username, status FROM Accounts WHERE username=%s;"
                cursor.execute(query, (ele,))
                result.append(cursor.fetchone())

            cursor.close()       
            return result

    # Lấy toàn bộ thông tin của account dựa trên username
    def getAccountInfo(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Accounts WHERE username=%s;"
            cursor.execute(query, (username,))
            result = cursor.fetchone()
            cursor.close()
            return result

    # isAvailableUsername: Nghĩa là username chưa tồn tại trong CSDL
    def isAvailableUsername(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT username FROM Accounts WHERE username=%s;"
            cursor.execute(query, (username,))
            result = cursor.fetchone()
            cursor.close()
            if (result == None):
                return True

        return False    

    # Tạo 1 tài khoản mới
    def createNewAccount(self, connection, username, password, email, phone):
        cursor = connection.cursor()
        if (cursor != None):
            if (isAvailableUsername(connection, username)):
                hashedPass = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
                query = "INSERT INTO Accounts(username, password, email, phone, createAt, updateAt) VALUES(%s, %s, %s, %s, %s, %s);"
                cursor.execute(query, (username, hashedPass, email, phone, datetime.now(), datetime.now()))
                cursor.close()
                print("[NOTICE] Create new account with username '{}' successfully".format(username))
            else:
                print("[NOTICE] Create new account fail, username '{}' is not available".format(username))

    # Activate lại tài khoản (sau khi deactive) dựa trên username
    def activateAccount(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET status=0 WHERE username=%s;"
            cursor.execute(query, (username,))
            cursor.close()
            print("[NOTICE] Activate account successfully")

    # Ngưng hoạt động tài khoản dựa trên username (Không cho phép xóa tài khoản)
    def deactiveAccount(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET status=-1 WHERE username=%s;"
            cursor.execute(query, (username,))
            cursor.close()
            print("[NOTICE] Deactive account successfully")

    # Cập nhật số điện thoại
    def updatePhone(self, connection, username, phone):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET phone=%s WHERE username=%s;"
            cursor.execute(query, (phone, username))
            cursor.close()

    # Cập nhật email
    def updateEmail(self, connection, username, email):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET email=%s WHERE username=%s;"
            cursor.execute(query, (email, username))
            cursor.close()

    # Cập nhật password
    def updatePassword(self, connection, username, password):
        cursor = connection.cursor()
        if (cursor != None):
            hashedPass = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
            query = "UPDATE Accounts SET password=%s WHERE username=%s;"
            cursor.execute(query, (hashedPass, username))
            cursor.close()

    # Cập nhật lại updateAt
    def updateUpdateAt(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Accounts SET updateAt=%s WHERE username=%s;"
            cursor.execute(query, (datetime.now(), username))
            cursor.close()       
            
    # TEST
    # createNewAccount(connection, "quoctk08", "123456", "Kienquoctran08@gmail.com", "0834970708")
    # createNewAccount(connection, "ngocvo98", "123456", "ngocvo9698@gmail.com", "0909132421")
    # createNewAccount(connection, "haian123", "123456", "haian123_cute@gmail.com", "0917684923")
    # createNewAccount(connection, "tuyetngo", "123456", "tuyet_quynh_ngo_91@gmail.com", "0839125745")
    # createNewAccount(connection, "tuankiet", "123456", "tuankiethcm@vng.com.vn", "0808567947")


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------CHATROOM-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Tạo ra chat room (ChatRooms) và thêm thông tin người tham gia (Participants)
    def createNewChatRoom(self, connection, username, friendUsername):
        cursor = connection.cursor()
        if (cursor != None):
            try:
                connection.autocommit = False
                query = "INSERT INTO ChatRooms(name) VALUES(%s);"
                roomname = username + '_' + friendUsername
                cursor.execute(query, (roomname,))
                roomid = cursor.lastrowid
                query = "INSERT INTO Participants(username, roomID, status) VALUES(%s, %s, 1);"
                cursor.execute(query, (username, roomid))
                query = "INSERT INTO Participants(username, roomID, status) VALUES(%s, %s, 1);"
                cursor.execute(query, (friendUsername, roomid))
                connection.commit()
            except mysql.connector.Error as error:
                print("[ERROR] Failed to create new chat room, database rollback needed: {}".format(error))
                connection.rollback()
            finally:
                cursor.close()
                connection.autocommit = True
                return roomid

    # Kiểm tra 1 user đã trong group hay chưa
    def isGroupMember(self, connection, username, roomid):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Participants WHERE username=%s AND roomID=%s;"
            cursor.execute(query, (username, roomid))
            result = cursor.fetchone()
            cursor.close()
            if (result != None):
                return True

        return False

    # Thêm 1 user khác vào group đã tồn tại
    def addMemberToChatGroup(self, connection, username, roomid):
        if (MYSQL.isGroupMember(self, connection, username, roomid)):
            return False
        cursor = connection.cursor()
        if (cursor != None):
            query = "INSERT INTO Participants(username, roomID) VALUES (%s, %s);"
            cursor.execute(query, (username, roomid))
            cursor.close()
            return True

        return False

    # Tạo ra chat group (1 phòng có >2 người tham gia chat) - tham số truyền vào là mảng username
    def createNewChatGroup(self, connection, userArray, roomName):
        cursor = connection.cursor()
        if (cursor != None):
            try:
                connection.autocommit = False
                query = "INSERT INTO ChatRooms(name, roomType) VALUES(%s, %s);"
                cursor.execute(query, (roomName, 1))
                roomid = cursor.lastrowid
                for ele in userArray:
                    query = "INSERT INTO Participants(username, roomID, status) VALUES(%s, %s, 1);"
                    cursor.execute(query, (ele, roomid))
                connection.commit()
            except mysql.connector.Error as error:
                print("[ERROR] Failed to create new chat group, database rollback needed: {}".format(error))
                connection.rollback()
            finally:
                cursor.close()
                connection.autocommit = True
                return roomid

    # Kiểm tra Group Name có chính xác với 1 group nào đó của mình hay không
    def checkNameOfMyGroupList(self, connection, myUsername, groupName):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT Croom.roomID, Croom.name, Croom.roomType FROM Participants AS Part INNER JOIN ChatRooms AS Croom ON Part.roomID=Croom.roomID WHERE Part.username=%s AND Croom.roomType=1 AND Croom.name=%s;"
            cursor.execute(query, (myUsername, groupName))
            result = cursor.fetchone()
            cursor.close()
            if (result != None):
                return result
            return None

    # Đổi Unseen thành Seen tin nhắn
    def updateSeenMessage(self, connection, username, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Participants SET status=1 WHERE username=%s AND roomID=%s;"
            cursor.execute(query, (username, roomID))
            cursor.close()

    # Đổi Seen thành Unseen tin nhắn cho tất cả mọi người
    def updateUnseenMessage(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Participants SET status=0 WHERE roomID=%s;"
            cursor.execute(query, (roomID,))
            cursor.close()

    # Cập nhật tên phòng
    def updateRoomName(self, connection, roomID, newRoomName):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE ChatRooms SET name=%s WHERE roomID=%s;"
            cursor.execute(query, (newRoomName, roomID))
            cursor.close()

    # Chọn ra danh sách phòng (Room) của những người bạn của mình
    # Chú thích về giá trị Part02.username nhận được: Đây là username của bạn mình
    def getRoomOfFriends(self, connection, username, userArray):
        cursor = connection.cursor()
        if (cursor != None):
            result = []
            for ele in userArray:
                query = "SELECT Part02.username, Part.roomID, Part.status, Croom.name, Part.totalMessages \
                        FROM (Participants AS Part INNER JOIN ChatRooms AS Croom ON Part.roomID=Croom.roomID)\
                        INNER JOIN Participants AS Part02 ON Part.roomID=Part02.roomID\
                        WHERE Croom.roomType=0 AND Part.username=%s AND Part02.username=%s;"
                cursor.execute(query, (username, ele))
                result.append(cursor.fetchone())

            cursor.close()
            return result

    # Lấy ra danh sách phòng (roomType=1 - groupchat) mà mình tham gia
    def getMyGroups(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT Part.roomID, Croom.name, Part.status FROM ChatRooms AS Croom INNER JOIN Participants AS Part ON Croom.roomID=Part.roomID WHERE Part.username=%s AND Croom.roomType=1;"
            cursor.execute(query, (username,))
            result = cursor.fetchall()
            cursor.close()
            return result        

    # Lấy tên phòng dựa trên ID
    def getRoomName(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT name FROM ChatRooms WHERE roomID=%s;"
            cursor.execute(query, (roomID,))
            result = cursor.fetchone()[0]
            cursor.close()
            return result

    # Lấy roomType dựa trên ID
    def getRoomType(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT roomType FROM ChatRooms WHERE roomID=%s;"
            cursor.execute(query, (roomID,))
            result = cursor.fetchone()[0]
            cursor.close()
            return result

    # Lấy thông tin username trong CHAT ROOM
    def getPartInfo(self, connection, username, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Participants WHERE roomID=%s AND username=%s;"
            cursor.execute(query, (roomID, username))
            result = cursor.fetchone()
            cursor.close()
            return result

    # Lấy tất cả thông tin Participants trong CHAT GROUP
    def getAllPartsInfo(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Participants WHERE roomID=%s;"
            cursor.execute(query, (roomID,))
            result = cursor.fetchall()
            cursor.close()
            return result

    # Lấy thông tin toàn bộ đối phương trong CHAT GROUP (ngoại trừ người truy vấn)
    def findFriendsInMyGroup(self, connection, exceptUsername, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Participants WHERE roomID=%s AND username!=%s;"
            cursor.execute(query, (roomID, exceptUsername))
            result = cursor.fetchall()
            cursor.close()
            return result

    # Kiếm bạn cùng phòng chat của mình (roomType = 0)
    def findFriendInMyRoom(self, connection, exceptUsername, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Participants WHERE roomID=%s AND username!=%s;"
            cursor.execute(query, (roomID, exceptUsername))
            result = cursor.fetchone()
            cursor.close()
            return result

    # Cộng thêm 1 giá trị totalMessages khi gửi tin nhắn
    def plus1TotalMessage(self, connection, username, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "UPDATE Participants SET totalMessages=totalMessages+1 WHERE username=%s AND roomID=%s;"
            cursor.execute(query, (username, roomID))
            cursor.close()

    # Tính tổng tin nhắn của những người khác trong 1 group
    def sumAllMsgInGroup(self, connection, exceptUsername, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT SUM(totalMessages) FROM Participants WHERE roomID=%s AND username!=%s;"
            cursor.execute(query, (roomID, exceptUsername))
            result = cursor.fetchone()[0]
            cursor.close()
            return result       

    # Kiểm tra xem, tin nhắn của mình gửi có ai trong group đã xem hay chưa
    def checkMsgIsSeenInGroup(self, connection, exceptUsername, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT username FROM Participants WHERE roomID=%s AND username!=%s AND status=1;"
            cursor.execute(query, (roomID, exceptUsername))
            var = cursor.fetchall()
            cursor.close()
            if (var != None):
                return True
            return False    

    # Rời khỏi group
    def leaveGroup(self, connection, username, roomid):
        cursor = connection.cursor()
        if (cursor != None):
            query = "DELETE FROM Participants WHERE roomID=%s AND username=%s;"
            cursor.execute(query, (roomid, username))
            cursor.close()

    # Xóa toàn bộ thông tin liên quan đến group 
    def deleteGroup(self, connection, roomid):
        cursor = connection.cursor()
        if (cursor != None):
            try:
                connection.autocommit = False
                query = "DELETE FROM Participants WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                query = "DELETE FROM Messages WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                query = "DELETE FROM ChatRooms WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                connection.commit()
                cursor.close()      
            except mysql.connector.Error as error:
                print("[ERROR] Failed to delete all info of group, database rollback needed: {}".format(error))
                connection.rollback()
            finally:
                cursor.close()
                connection.autocommit = True

    # TEST
    # userArray = ["quoctk08", haian123", "tuyetngo", "tuankiet"]
    # createNewChatGroup(connection, userArray)
    # userArray = ["quoctk08", "haian123", "tuankiet"]
    # createNewChatGroup(connection, userArray)
    # userArray = ["ngocvo98", "haian123", "tuankiet"]
    # createNewChatGroup(connection, userArray)

    # userArray = ["haian123", "tuyetngo", "tuankiet"]
    # print(getRoomOfFriends(connection, "quoctk08", userArray))


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------FRIEND-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Lấy danh sách bạn bè của mình
    def getFriendList(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT username, friendUsername FROM Friends WHERE (username=%s OR friendUsername=%s) AND status=%s;"
            cursor.execute(query, (username, username, FriendStatus.ISFRIEND.value))
            values = cursor.fetchall()
            cursor.close()
            result = []
            for var in values:
                if (var[0] != username):
                    result.append(var[0])
                else:
                    result.append(var[1])
            return result

    # Lấy danh sách yêu cầu kết bạn đến mình
    def getFriendRequestList(self, connection, username):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT username FROM Friends WHERE friendUsername=%s AND status=%s;"
            cursor.execute(query, (username, FriendStatus.REQUESTFRIEND.value))
            values = cursor.fetchall()
            cursor.close()
            result = []
            for var in values:
                result.append(var[0])
            return result

    # Kiểm tra đã là bạn bè của nhau hay chưa
    def isFriendEachOther(self, connection, username, friendUsername):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Friends WHERE (username=%s AND friendUsername=%s) OR (username=%s AND friendUsername=%s);"
            cursor.execute(query, (username, friendUsername, friendUsername, username))
            result = cursor.fetchone()
            cursor.close()
            if (result != None):
                return True

        return False

    # Gửi yêu cầu kết bạn dựa trên username của mình và username đối phương
    def requestFriend(self, connection, username, friendUsername):
        cursor = connection.cursor()
        if (cursor != None):
            if (MYSQL.isFriendEachOther(self, connection, username, friendUsername)):
                return False
            else:
                query = "INSERT INTO Friends(username, friendUsername, status) VALUES(%s, %s, %s);"
                cursor.execute(query, (username, friendUsername, FriendStatus.REQUESTFRIEND.value))
                cursor.close()
                return True

        return False

    # Hủy lời mời kết bạn
    def cancelFriendRequest(self, connection, username, friendUsername):
        cursor = connection.cursor()
        if (cursor != None):
            query = "DELETE FROM Friends WHERE username=%s AND friendUsername=%s AND status=%s;"
            cursor.execute(query, (friendUsername, username, FriendStatus.REQUESTFRIEND.value))
            cursor.close()

    # Chấp nhận lời mời kết bạn của nhau & tạo ra phòng chat cho nhau
    def acceptFriendRequest(self, connection, username, friendUsername):
        cursor = connection.cursor()
        if (cursor != None):
            try:
                connection.autocommit = False
                query = "UPDATE Friends SET status=%s WHERE username=%s AND friendUsername=%s AND status=%s;"
                cursor.execute(query, (FriendStatus.ISFRIEND.value, friendUsername, username, FriendStatus.REQUESTFRIEND.value))
                roomid = MYSQL.createNewChatRoom(self, connection, username, friendUsername)
                connection.commit()
            except mysql.connector.Error as error:
                print("[ERROR] Failed to accept friend request & create chat room, database rollback needed: {}".format(error))
                connection.rollback()
            finally:
                cursor.close()
                connection.autocommit = True
                return roomid

    # Unfriend (Xóa toàn bộ dữ liệu giữa 2 người: Participants, Messages, ChatRooms, Friends)
    def unfriend(self, connection, myUsername, myRoomFriend, roomid):
        cursor = connection.cursor()
        if (cursor != None):
            try:
                connection.autocommit = False
                query = "DELETE FROM Participants WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                query = "DELETE FROM Messages WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                query = "DELETE FROM ChatRooms WHERE roomID=%s;"
                cursor.execute(query, (roomid,))
                query = "DELETE FROM Friends WHERE (username=%s AND friendUsername=%s) OR (username=%s AND friendUsername=%s);"
                cursor.execute(query, (myUsername, myRoomFriend, myRoomFriend, myUsername))
                connection.commit()
            except mysql.connector.Error as error:
                print("[ERROR] Failed to unfriend, database rollback needed: {}".format(error))
                connection.rollback()
            finally:
                cursor.close()
                connection.autocommit = True

    # TEST
    # requestFriend(connection, "quoctk08", "haian123")
    # requestFriend(connection, "haian123", "ngocvo98")
    # requestFriend(connection, "haian123", "tuyetngo")
    # requestFriend(connection, "tuyetngo", "quoctk08")
    # requestFriend(connection, "tuankiet", "ngocvo98")
    # requestFriend(connection, "quoctk08", "tuankiet")

    # print(getFriendRequestList(connection, "ngocvo98"))  # Người gửi yêu cầu kết bạn đến ngocvo98: haian123, tuankiet
    # print(getFriendRequestList(connection, "haian123"))  # Người gửi yêu cầu kết bạn đến haian123: quoctk08
    # print(getFriendRequestList(connection, "quoctk08"))  # Người gửi yêu cầu kết bạn đến quoctk08: tuyetngo

    # acceptFriendRequest(connection, "ngocvo98", "haian123")
    # acceptFriendRequest(connection, "ngocvo98", "tuankiet")
    # acceptFriendRequest(connection, "quoctk08", "tuyetngo")
    # acceptFriendRequest(connection, "tuankiet", "quoctk08")
    # acceptFriendRequest(connection, "haian123", "quoctk08")

    # print(getFriendList(connection, "quoctk08"))
    # print(getFriendList(connection, "ngocvo98"))
    # print(getFriendList(connection, "tuyetngo"))
    # print(getFriendList(connection, "tuankiet"))


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------MESSAGE-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Lấy toàn bộ nội dung chat thuộc về 1 phòng (Room/Group) nào đó
    # Xếp giảm dần (tin nhắn cũ ở trên, tin nhắn mới ở dưới cùng)
    def getAllMessages(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT authorID, content, createAt FROM Messages WHERE roomID=%s ORDER BY createAt ASC;"
            cursor.execute(query, (roomID,))
            result = cursor.fetchall()
            cursor.close()
            newresult = []
            for ele in result:
                ele = list(ele)
                ele[2] = str(ele[2])
                newresult.append(ele)
            return newresult

    # Lưu tin nhắn xuống CSDL
    def saveMessage(self, connection, roomID, authorID, content, createAt):
        cursor = connection.cursor()
        if (cursor != None):
            query = "INSERT INTO Messages(roomID, authorID, content, createAt) VALUES(%s, %s, %s, %s);"
            cursor.execute(query, (roomID, authorID, content, createAt))
            cursor.close()

    # Chat group: Lấy thông tin tác giả - người gửi tin nhắn gần đây nhất
    def getNewestMsgInfoOfGroup(self, connection, roomID):
        cursor = connection.cursor()
        if (cursor != None):
            query = "SELECT * FROM Messages WHERE roomID=%s ORDER BY messageID DESC LIMIT 1;"
            cursor.execute(query, (roomID,))
            result = cursor.fetchone()
            cursor.close()        
            return result

