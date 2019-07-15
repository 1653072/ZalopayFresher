import connectDB

# TEST
# connectDB.connectToDB()
# connection = connectDB.getConnection()

# Lấy toàn bộ nội dung chat thuộc về 1 phòng (Room/Group) nào đó
# Xếp giảm dần (tin nhắn cũ ở trên, tin nhắn mới ở dưới cùng)
def getAllMessages(connection, roomID):
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
def saveMessage(connection, roomID, authorID, content, createAt):
    cursor = connection.cursor()
    if (cursor != None):
        query = "INSERT INTO Messages(roomID, authorID, content, createAt) VALUES(%s, %s, %s, %s);"
        cursor.execute(query, (roomID, authorID, content, createAt))
        cursor.close()


# TEST
# connectDB.closeConnectToDB()