import connectDB

# TEST
# connectDB.connectToDB()
# connection = connectDB.getConnection()

# Định nghĩa loại Room:
# + roomType=0 (Default): Friend to Friend (Chat room)
# + roomType=1: Friend to Group (Chat group)

# Định nghĩa loại Status trong table Participants:
# + status=0 (Default): Unseen
# + status=1: Seen

# Tạo ra chat room (ChatRooms) và thêm thông tin người tham gia (Participants)
def createNewChatRoom(connection, username, friendUsername):
    cursor = connection.cursor()
    if (cursor != None):
        try:
            connection.autocommit = False
            query = "INSERT INTO ChatRooms(name) VALUES(%s);"
            roomname = username + '_' + friendUsername
            cursor.execute(query, (roomname,))
            query = "SELECT MAX(roomID) FROM ChatRooms;"
            cursor.execute(query)
            roomid = cursor.fetchone()[0]
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
def isGroupMember(connection, username, roomid):
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
def addMemberToChatGroup(connection, username, roomid):
    if (isGroupMember(connection, username, roomid)):
        return False
    cursor = connection.cursor()
    if (cursor != None):
        query = "INSERT INTO Participants(username, roomID) VALUES (%s, %s);"
        cursor.execute(query, (username, roomid))
        cursor.close()
        return True

    return False

# Tạo ra chat group (1 phòng có >2 người tham gia chat) - tham số truyền vào là mảng username
def createNewChatGroup(connection, userArray):
    cursor = connection.cursor()
    if (cursor != None):
        try:
            connection.autocommit = False
            roomname = "Group-"
            for ele in userArray:
                roomname += ele[0]
            query = "INSERT INTO ChatRooms(name, roomType) VALUES(%s, %s);"
            cursor.execute(query, (roomname, 1))
            for ele in userArray:
                query = "INSERT INTO Participants(username, roomID) SELECT %s, MAX(roomID) FROM ChatRooms;"
                cursor.execute(query, (ele,))
            connection.commit()
        except mysql.connector.Error as error:
            print("[ERROR] Failed to create new chat group, database rollback needed: {}".format(error))
            connection.rollback()
        finally:
            cursor.close()
            connection.autocommit = True

# Tìm kiếm phòng chat dựa trên friendUsername & roomType. Tuy nhiên, phải là bạn của nhau thì mới thấy
def findChatRoomAndGroup(connection, username, friendUsername, roomType):
    from friendDB import isFriendEachOther
    if (roomType!=0 and roomType!=1):
        return None
    if not (isFriendEachOther(connection, username, friendUsername)):
        return None
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT croom.roomID, croom.name FROM Participants AS part INNER JOIN ChatRooms AS croom ON part.roomID=croom.roomID \
                WHERE part.username=%s AND croom.roomType=%s;"
        cursor.execute(query, (username, roomType))
        result = cursor.fetchall()
        cursor.close()
        return result

# Đổi Unseen thành Seen tin nhắn
def updateSeenMessage(connection, username, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Participants SET status=1 WHERE username=%s AND roomID=%s;"
        cursor.execute(query, (username, roomID))
        cursor.close()

# Đổi Seen thành Unseen tin nhắn cho tất cả mọi người (ngoại trừ mình)
def updateUnseenMessage(connection, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Participants SET status=0 WHERE roomID=%s;"
        cursor.execute(query, (roomID,))
        cursor.close()

# Kiếm bạn cùng phòng của mình (roomType = 0)
def findFriendInMyRoom(connection, myUsername, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT * FROM Participants WHERE roomID=%s AND username!=%s;"
        cursor.execute(query, (roomID, myUsername))
        result = cursor.fetchone()
        cursor.close()
        return result

# Chọn ra danh sách phòng (Room) của những người bạn của mình
# Chú thích về giá trị Part02.username nhận được: Đây là username của bạn mình
def getRoomOfFriends(connection, username, userArray):
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

# Lấy tên phòng dựa trên ID
def getRoomName(connection, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT name FROM ChatRooms WHERE roomID=%s;"
        cursor.execute(query, (roomID,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

# Lấy roomType dựa trên ID
def getRoomType(connection, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT roomType FROM ChatRooms WHERE roomID=%s;"
        cursor.execute(query, (roomID,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

# Lấy thông tin toàn bộ đối phương trong CHAT GROUP (ngoại trừ người truy vấn)
def getMorePartsInfo(connection, exceptUsername, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT * FROM Participants WHERE roomID=%s AND username!=%s;"
        cursor.execute(query, (roomID, exceptUsername))
        result = cursor.fetchall()
        cursor.close()
        return result

# Lấy thông tin username trong CHAT ROOM
def getOnePartInfo(connection, username, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT * FROM Participants WHERE roomID=%s AND username=%s;"
        cursor.execute(query, (roomID, username))
        result = cursor.fetchone()
        cursor.close()
        return result

# Cộng thêm 1 giá trị totalMessages khi gửi tin nhắn
def plus1TotalMessage(connection, username, roomID):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Participants SET totalMessages=totalMessages+1 WHERE username=%s AND roomID=%s;"
        cursor.execute(query, (username, roomID))
        cursor.close()

# TEST
# userArray = ["quoctk08", haian123", "tuyetngo", "tuankiet"]
# createNewChatGroup(connection, userArray)
# userArray = ["quoctk08", "haian123", "tuankiet"]
# createNewChatGroup(connection, userArray)
# userArray = ["ngocvo98", "haian123", "tuankiet"]
# createNewChatGroup(connection, userArray)

# print(findChatRoomAndGroup(connection, "quoctk08", "tuyetngo", 1))
# print(findChatRoomAndGroup(connection, "tuyetngo", "tuankiet", 1))
# print(findChatRoomAndGroup(connection, "ngocvo98", "haian123", 1))
# print(findChatRoomAndGroup(connection, "ngocvo98", "tuankiet", 0))
# print(findChatRoomAndGroup(connection, "tuankiet", "quoctk08", 0))

# userArray = ["haian123", "tuyetngo", "tuankiet"]
# print(getRoomOfFriends(connection, "quoctk08", userArray))
# connectDB.closeConnectToDB()