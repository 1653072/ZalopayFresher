import connectDB
from enum import Enum

# TEST
# connectDB.connectToDB()
# connection = connectDB.getConnection()

# Định nghĩa status bạn bè của nhau
# Default: REQUEST FRIEND (0)
class FriendStatus(Enum):
    REQUESTFRIEND = 0
    ISFRIEND = 1
    CLOSEFRIEND = 2

# Lấy danh sách bạn bè của mình
def getFriendList(connection, username):
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
def getFriendRequestList(connection, username):
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
def isFriendEachOther(connection, username, friendUsername):
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
def requestFriend(connection, username, friendUsername):
    cursor = connection.cursor()
    if (cursor != None):
        if (isFriendEachOther(connection, username, friendUsername)):
            return False
        else:
            query = "INSERT INTO Friends(username, friendUsername, status) VALUES(%s, %s, %s);"
            cursor.execute(query, (username, friendUsername, FriendStatus.REQUESTFRIEND.value))
            cursor.close()
            return True

    return False

# Hủy lời mời kết bạn
def cancelFriendRequest(connection, username, friendUsername):
    cursor = connection.cursor()
    if (cursor != None):
        query = "DELETE FROM Friends WHERE username=%s AND friendUsername=%s AND status=%s;"
        cursor.execute(query, (friendUsername, username, FriendStatus.REQUESTFRIEND.value))
        cursor.close()

# Chấp nhận lời mời kết bạn của nhau & tạo ra phòng chat cho nhau
def acceptFriendRequest(connection, username, friendUsername):
    from chatroomDB import createNewChatRoom
    cursor = connection.cursor()
    if (cursor != None):
        try:
            connection.autocommit = False
            query = "UPDATE Friends SET status=%s WHERE username=%s AND friendUsername=%s AND status=%s;"
            cursor.execute(query, (FriendStatus.ISFRIEND.value, friendUsername, username, FriendStatus.REQUESTFRIEND.value))
            roomid = createNewChatRoom(connection, username, friendUsername)
            connection.commit()
        except mysql.connector.Error as error:
            print("[ERROR] Failed to accept friend request & create chat room, database rollback needed: {}".format(error))
            connection.rollback()
        finally:
            cursor.close()
            connection.autocommit = True
            return roomid


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

# connectDB.closeConnectToDB()