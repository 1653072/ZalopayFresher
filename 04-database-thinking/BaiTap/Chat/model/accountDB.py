import connectDB
import bcrypt
from datetime import datetime

# TEST
# connectDB.connectToDB()
# connection = connectDB.getConnection()

# Định nghĩa các trạng thái (status) của 1 account:
# status = -1           => Deactive
# status = 0 (Default)  => Offline
# status = 1            => Online

# Hàm kiểm tra đăng nhập có hợp lệ => TRUE: hợp lệ, FALSE: không hợp lệ
def checkLoginAccount(connection, username, password):
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
def updateOnlineStatus(connection, username):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET status=1 WHERE username=%s;"
        cursor.execute(query, (username,))
        cursor.close()

# Cập nhật status từ Online (1) thành Offline (0) dựa trên username
def updateOfflineStatus(connection, username):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET status=0 WHERE username=%s;"
        cursor.execute(query, (username,))
        cursor.close()

# Lấy status (Online/Active) từ danh sách bạn bè cho sẵn
def getActiveList(connection, userArray):
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
def getAccountInfo(connection, username):
    cursor = connection.cursor()
    if (cursor != None):
        query = "SELECT * FROM Accounts WHERE username=%s;"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        return result

# isAvailableUsername: Nghĩa là username chưa tồn tại trong CSDL
def isAvailableUsername(connection, username):
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
def createNewAccount(connection, username, password, email, phone):
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
def activateAccount(connection, username):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET status=0 WHERE username=%s;"
        cursor.execute(query, (username,))
        cursor.close()
        print("[NOTICE] Activate account successfully")

# Ngưng hoạt động tài khoản dựa trên username (Không cho phép xóa tài khoản)
def deactiveAccount(connection, username):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET status=-1 WHERE username=%s;"
        cursor.execute(query, (username,))
        cursor.close()
        print("[NOTICE] Deactive account successfully")

# Cập nhật số điện thoại
def updatePhone(connection, username, phone):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET phone=%s WHERE username=%s;"
        cursor.execute(query, (phone, username))
        cursor.close()

# Cập nhật email
def updateEmail(connection, username, email):
    cursor = connection.cursor()
    if (cursor != None):
        query = "UPDATE Accounts SET email=%s WHERE username=%s;"
        cursor.execute(query, (email, username))
        cursor.close()

# Cập nhật password
def updatePassword(connection, username, password):
    cursor = connection.cursor()
    if (cursor != None):
        hashedPass = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
        query = "UPDATE Accounts SET password=%s WHERE username=%s;"
        cursor.execute(query, (hashedPass, username))
        cursor.close()

# Cập nhật lại updateAt
def updateUpdateAt(connection, username):
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
# connectDB.closeConnectToDB()