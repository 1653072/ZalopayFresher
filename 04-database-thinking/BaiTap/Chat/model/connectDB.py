import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

# Khai báo config của DB
config = {
    'host': '127.0.0.1',
    'database': 'ChatDB',
    'user': 'root',
    'password': 'Kienquoc123',
    'autocommit': True
}

# Hàm kết nối DB
def connectToDB():
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
def closeConnectToDB(connection):
    if (connection.is_connected()):
        connection.close()
        print("[NOTICE] MySQL connection is closed")


# Tham khảo:
# + https://pynative.com/python-mysql-database-connection/
# + https://dev.mysql.com/doc/connector-python/en/connector-python-example-connecting.html