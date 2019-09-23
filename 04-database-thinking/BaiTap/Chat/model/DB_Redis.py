# Import libs
from DB_Abstract import *
import redis
import bcrypt
from datetime import datetime
from enum import Enum
import json
import uuid

# Khai báo config của DB
# db=0: Redis có thể hỗ trợ lên đến 16DB (tương ứng 0-15), mặc định là số 0 "redis://localhost:6379/0"
config = {
    'host': '127.0.0.1',
    'port': 6379,   
    'db': 0
}

# Định nghĩa status bạn bè của nhau
# Default: REQUEST FRIEND (0)
class FriendStatus(Enum):
    REQUESTFRIEND = 0
    ISFRIEND = 1

# Các nguồn tham khảo:
# + https://pythontic.com/database/redis/hash%20-%20add%20and%20remove%20elements
# + https://toidicode.com/dictionary-trong-python-348.html
# + https://realpython.com/python-keyerror/
# + https://www.geeksforgeeks.org/python-list-sort/


#--------------------------------------------------------------------------------------------------------
#-------------------------------------HÀM CHUNG (NO ABSTRACT)-------------------------------------
#--------------------------------------------------------------------------------------------------------
# Hàm lấy data của username
def getJSONDataOfAccount(connection, username):
    data = connection.hget("Accounts", username)
    data = data.decode("utf-8")
    data = json.loads(data)
    return data

# Take third element for sort
def takeThird(ele):
    return ele[2]

# Take four element for sort
def takeFour(ele):
    return ele[3]


# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


class REDIS(DB_Abstract):


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------CONNECTOR-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Hàm kết nối DB
    def connectToDB(self):
        r = redis.Redis(**config)
        return r

    # Hàm ngắt kết nối DB
    def closeConnectToDB(self, connection):
        return


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------ACCOUNT-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Hàm kiểm tra đăng nhập có hợp lệ => TRUE: hợp lệ, FALSE: không hợp lệ
    def checkLoginAccount(self, connection, username, password):
        data = getJSONDataOfAccount(connection, username)
        passHashed = data['password']
        if (bcrypt.checkpw(password, passHashed)):
            return True
        return False

    # Cập nhật status từ Offline (0) thành Online (1) dựa trên username
    def updateOnlineStatus(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        data['status'] = 1
        connection.hset("Accounts", username, json.dumps(data))

    # Cập nhật status từ Online (1) thành Offline (0) dựa trên username
    def updateOfflineStatus(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        data['status'] = 0
        connection.hset("Accounts", username, json.dumps(data))

    # Lấy status (Online/Active) từ danh sách bạn bè cho sẵn
    def getActiveList(self, connection, userArray):
        result = []
        for ele in userArray:
            data = getJSONDataOfAccount(connection, ele)
            val = []
            val.append(data['username'])
            val.append(data['status'])
            result.append(val)
        return result

    # Lấy toàn bộ thông tin của account dựa trên username
    def getAccountInfo(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        result = []
        result.append(data['username'])
        result.append(data['password'])
        result.append(data['email'])
        result.append(data['phone'])
        result.append(data['status'])
        result.append(data['createAt'])
        result.append(data['updateAt'])
        return result

    # isAvailableUsername: Nghĩa là username chưa tồn tại trong CSDL
    def isAvailableUsername(self, connection, username):
        return not (connection.hexists("Accounts", username))

    # Tạo 1 tài khoản mới
    def createNewAccount(self, connection, username, password, email, phone):
        if (REDIS.isAvailableUsername(self, connection, username)):
            hashedPass = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
            data = {
                'username': username,
                'password': hashedPass,
                'email': email,
                'phone': phone,
                'status': 0,
                'createAt': str(datetime.now()),
                'updateAt': str(datetime.now())
            }
            connection.hset("Accounts", username, json.dumps(data))
            print("[NOTICE] Create new account with username '{}' successfully".format(username))
        else:
            print("[NOTICE] Create new account fail, username '{}' is not available".format(username))

    # Activate lại tài khoản (sau khi deactive) dựa trên username
    def activateAccount(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        data['status'] = 0
        connection.hset("Accounts", username, json.dumps(data))

    # Ngưng hoạt động tài khoản dựa trên username (Không cho phép xóa tài khoản)
    def deactiveAccount(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        data['status'] = -1
        connection.hset("Accounts", username, json.dumps(data))

    # Cập nhật số điện thoại
    def updatePhone(self, connection, username, phone):
        data = getJSONDataOfAccount(connection, username)
        data['phone'] = phone
        connection.hset("Accounts", username, json.dumps(data))

    # Cập nhật email
    def updateEmail(self, connection, username, email):
        data = getJSONDataOfAccount(connection, username)
        data['email'] = email
        connection.hset("Accounts", username, json.dumps(data))

    # Cập nhật password
    def updatePassword(self, connection, username, password):
        data = getJSONDataOfAccount(connection, username)
        data['password'] = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
        connection.hset("Accounts", username, json.dumps(data))

    # Cập nhật lại updateAt
    def updateUpdateAt(self, connection, username):
        data = getJSONDataOfAccount(connection, username)
        data['updateAt'] = str(datetime.now())
        connection.hset("Accounts", username, json.dumps(data))


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------CHATROOM-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Tạo ra chat room (ChatRooms) và thêm thông tin người tham gia (Participants)
    def createNewChatRoom(self, connection, username, friendUsername):
        roomname = username + '_' + friendUsername
        roomid = str(uuid.uuid4())
        dataCR = {
                'roomID': roomid,
                'name': roomname,
                'roomType': 0
            }
        connection.hset("ChatRooms", roomid, json.dumps(dataCR))

        dataPart = {
            'username': username,
            'roomID': roomid,
            'status': 1,
            'totalMessages': 0
        }
        keyDataPart = {
            'username': username,
            'roomID': roomid
        }
        connection.hset("Participants", json.dumps(keyDataPart), json.dumps(dataPart))

        dataPart2 = {
            'username': friendUsername,
            'roomID': roomid,
            'status': 1,
            'totalMessages': 0
        }
        keyDataPart2 = {
            'username': friendUsername,
            'roomID': roomid
        }
        connection.hset("Participants", json.dumps(keyDataPart2), json.dumps(dataPart2))

        return roomid

    # Kiểm tra 1 user đã trong group hay chưa
    def isGroupMember(self, connection, username, roomid):
        keyDataPart = {
            'username': username,
            'roomID': roomid
        }
        return (connection.hexists("Participants", json.dumps(keyDataPart)))

    # Thêm 1 user khác vào group đã tồn tại
    def addMemberToChatGroup(self, connection, username, roomid):
        if (REDIS.isGroupMember(self, connection, username, roomid)):
            return False
        else:
            dataPart = {
                'username': username,
                'roomID': roomid,
                'status': 1,
                'totalMessages': 0
            }
            keyDataPart = {
                'username': username,
                'roomID': roomid
            }
            connection.hset("Participants", json.dumps(keyDataPart), json.dumps(dataPart))
            return True

    # Tạo ra chat group (1 phòng có >2 người tham gia chat) - tham số truyền vào là mảng username
    def createNewChatGroup(self, connection, userArray, roomName):  
        roomid = str(uuid.uuid4())
        dataCG = {
            'roomID': roomid,
            'name': roomName,
            'roomType': 1
        }
        connection.hset("ChatRooms", roomid, json.dumps(dataCG))

        for ele in userArray:
            dataPart = {
                'username': ele,
                'roomID': roomid,
                'status': 1,
                'totalMessages': 0
            }
            keyDataPart = {
                'username': ele,
                'roomID': roomid
            }
            connection.hset("Participants", json.dumps(keyDataPart), json.dumps(dataPart))
        
        return roomid

    # Kiểm tra Group Name có chính xác với 1 group nào đó của mình hay không
    def checkNameOfMyGroupList(self, connection, myUsername, groupName):
        dataCG = connection.hvals("ChatRooms")
        tempCG = []
        for ele in dataCG:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomType']==1 and val['name']==groupName):
                tempCG.append(ele)

        dataPart = connection.hkeys("Participants")
        tempPart = []
        for ele in dataPart:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['username']==myUsername):
                tempPart.append(ele)

        for eleCG in tempCG:
            valCG = eleCG.decode("utf-8")
            valCG = json.loads(valCG)
            for elePart in tempPart:
                valP = elePart.decode("utf-8")
                valP = json.loads(valP)
                if (valCG['roomID']==valP['roomID']):
                    value = []
                    value.append(valCG['roomID'])
                    value.append(valCG['name'])
                    value.append(valCG['roomType'])
                    return value

        return None
    
    # Đổi Unseen thành Seen tin nhắn
    def updateSeenMessage(self, connection, username, roomID):
        dataKey = {
            'username': username,
            'roomID': roomID
        }
        data = connection.hget("Participants", json.dumps(dataKey))
        data = data.decode("utf-8")
        data = json.loads(data)
        data['status'] = 1
        connection.hset("Participants", json.dumps(dataKey), json.dumps(data))

    # Đổi Seen thành Unseen tin nhắn cho tất cả mọi người (ngoại trừ mình)
    def updateUnseenMessage(self, connection, roomID):
        dataVals = connection.hvals("Participants")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID):
                val['status'] = 0
                dataKey = {
                    'username': val['username'],
                    'roomID': val['roomID']
                }
                connection.hset("Participants", json.dumps(dataKey), json.dumps(val))
        
    # Cập nhật tên phòng
    def updateRoomName(self, connection, roomID, newRoomName):
        data = connection.hget("ChatRooms", roomID)
        data = data.decode("utf-8")
        data = json.loads(data)
        data['name'] = newRoomName
        connection.hset("ChatRooms", roomID, json.dumps(data))
    
    # Chọn ra danh sách phòng (Room) của những người bạn của mình
    # Chú thích về giá trị Part02.username nhận được: Đây là username của bạn mình
    def getRoomOfFriends(self, connection, username, userArray):
        dataValsPart = connection.hvals("Participants")
        tempPart = []
        for ele in dataValsPart:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['username']==username):
                tempPart.append(ele)

        dataValsCR = connection.hvals("ChatRooms")
        myRooms = []
        for elePart in tempPart:
            valP = elePart.decode("utf-8")
            valP = json.loads(valP)
            for eleCR in dataValsCR:
                valCR = eleCR.decode("utf-8")
                valCR = json.loads(valCR)
                if (valP['roomID']==valCR['roomID'] and valCR['roomType']==0):
                    myRooms.append(eleCR)

        roomsOfFriend = []
        for ele in userArray:
            for elePart in dataValsPart:
                val = elePart.decode("utf-8")
                val = json.loads(val)
                if (val['username']==ele):
                    roomsOfFriend.append(elePart)

        result = []
        for ele in roomsOfFriend:
            val = ele.decode("utf-8")
            val = json.loads(val)
            for ptu in myRooms:
                mr = ptu.decode("utf-8")
                mr = json.loads(mr)
                if (val['roomID']==mr['roomID']):
                    value = []
                    value.append(val['username'])
                    value.append(val['roomID'])
                    value.append(val['status'])
                    value.append(mr['name'])
                    value.append(val['totalMessages'])
                    result.append(value)
        
        if (len(result) == 0):
            return None
        return result

    # Lấy ra danh sách phòng (roomType=1 - groupchat) mà mình tham gia
    def getMyGroups(self, connection, username):
        dataCG = connection.hvals("ChatRooms")
        tempCG = []
        for ele in dataCG:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomType']==1):
                tempCG.append(ele)

        dataPart = connection.hvals("Participants")
        tempPart = []
        for ele in dataPart:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['username']==username):
                tempPart.append(ele)
        
        result = []
        for eleCG in tempCG:
            valCG = eleCG.decode("utf-8")
            valCG = json.loads(valCG)
            for elePart in tempPart:
                valP = elePart.decode("utf-8")
                valP = json.loads(valP)
                if (valCG['roomID']==valP['roomID']):
                    value = []
                    value.append(valP['roomID'])
                    value.append(valCG['name'])
                    value.append(valP['status'])
                    result.append(value)

        if (len(result) == 0):
            return None
        return result

    # Lấy tên phòng dựa trên ID
    def getRoomName(self, connection, roomID):
        data = connection.hget("ChatRooms", roomID)
        data = data.decode("utf-8")
        data = json.loads(data)
        return data['name']

    # Lấy roomType dựa trên ID
    def getRoomType(self, connection, roomID):
        data = connection.hget("ChatRooms", roomID)
        data = data.decode("utf-8")
        data = json.loads(data)
        return data['roomType']

    # Lấy thông tin username trong CHAT ROOM
    def getPartInfo(self, connection, username, roomID):
        dataKey = {
            'username': username,
            'roomID': roomID
        }
        data = connection.hget("Participants", json.dumps(dataKey))
        data = data.decode("utf-8")
        data = json.loads(data)
        result = []
        result.append(data['username'])
        result.append(data['roomID'])
        result.append(data['status'])
        result.append(data['totalMessages'])
        return result

    # Lấy tất cả thông tin Participants trong CHAT GROUP
    def getAllPartsInfo(self, connection, roomID):
        dataVals = connection.hvals("Participants")
        result = []
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID):
                value = []
                value.append(val['username'])
                value.append(val['roomID'])
                value.append(val['status'])
                value.append(val['totalMessages'])
                result.append(value)
        return result

    # Lấy thông tin toàn bộ đối phương trong CHAT GROUP (ngoại trừ người truy vấn)
    def findFriendsInMyGroup(self, connection, exceptUsername, roomID):
        dataVals = connection.hvals("Participants")
        result = []
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID and val['username']!=exceptUsername):
                value = []
                value.append(val['username'])
                value.append(val['roomID'])
                value.append(val['status'])
                value.append(val['totalMessages'])
                result.append(value)
        return result
    
    # Kiếm bạn cùng phòng chat của mình (roomType = 0)
    def findFriendInMyRoom(self, connection, exceptUsername, roomID):
        dataVals = connection.hvals("Participants")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID and val['username']!=exceptUsername):
                value = []
                value.append(val['username'])
                value.append(val['roomID'])
                value.append(val['status'])
                value.append(val['totalMessages'])
                return value
        return None
    
    # Cộng thêm 1 giá trị totalMessages khi gửi tin nhắn
    def plus1TotalMessage(self, connection, username, roomID):
        dataKey = {
            'username': username,
            'roomID': roomID
        }
        data = connection.hget("Participants", json.dumps(dataKey))
        data = data.decode("utf-8")
        data = json.loads(data)
        data['totalMessages'] = data['totalMessages'] + 1
        connection.hset("Participants", json.dumps(dataKey), json.dumps(data))

    # Tính tổng tin nhắn của những người khác trong 1 group
    def sumAllMsgInGroup(self, connection, exceptUsername, roomID):
        dataVals = connection.hvals("Participants")
        totalMessages = 0
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID and val['username']!=exceptUsername):
                totalMessages += val['totalMessages']
        return totalMessages

    # Kiểm tra xem, tin nhắn của mình gửi có ai trong group đã xem hay chưa
    def checkMsgIsSeenInGroup(self, connection, exceptUsername, roomID):
        dataVals = connection.hvals("Participants")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID and val['username']!=exceptUsername and val['status']==1):
                return True
        return False

    # Rời khỏi group
    def leaveGroup(self, connection, username, roomid):
        dataKey = {
            'username': username,
            'roomID': roomid
        }
        connection.hdel("Participants", json.dumps(dataKey))

    # Xóa toàn bộ thông tin liên quan đến group 
    def deleteGroup(self, connection, roomid):
        dataKeys = connection.hkeys("Participants")
        for ele in dataKeys:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomid):
                connection.hdel("Participants", ele)

        dataVals = connection.hvals("Messages")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomid):
                connection.hdel("Messages", json.dumps(val['messageID']))

        connection.hdel("ChatRooms", roomid)


    #--------------------------------------------------------------------------------------------------------
    #-------------------------------------FRIEND-------------------------------------
    #--------------------------------------------------------------------------------------------------------
    # Lấy danh sách bạn bè của mình
    def getFriendList(self, connection, username):
        data = connection.hvals("Friends")
        result = []
        for ele in data:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if ((val['friendUsername']==username or val['username']==username) and val['status']==FriendStatus.ISFRIEND.value):
                if (val['friendUsername']==username): result.append(val['username'])
                else: result.append(val['friendUsername'])

        return result

    # Lấy danh sách yêu cầu kết bạn đến mình
    def getFriendRequestList(self, connection, username):
        data = connection.hvals("Friends")
        result = []
        for ele in data:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['friendUsername']==username and val['status']==FriendStatus.REQUESTFRIEND.value):
                result.append(val['username'])   
                
        return result
    
    # Kiểm tra đã là bạn bè của nhau hay chưa
    def isFriendEachOther(self, connection, username, friendUsername):
        data = connection.hvals("Friends")
        result = []
        for ele in data:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if ((val['friendUsername']==username and val['username']==friendUsername) or (val['friendUsername']==friendUsername and val['username']==username)):
                valCheck = []
                valCheck.extend(val)
                result.append(valCheck)

        if (len(result) != 0):
            return True
        return False

    # Gửi yêu cầu kết bạn dựa trên username của mình và username đối phương
    def requestFriend(self, connection, username, friendUsername):
        if (REDIS.isFriendEachOther(self, connection, username, friendUsername)):
            return False
        else:
            key = {
                'username': username,
                'friendUsername': friendUsername
            }
            data = {
                'username': username,
                'friendUsername': friendUsername,
                'status': FriendStatus.REQUESTFRIEND.value
            }
            connection.hset("Friends", json.dumps(key), json.dumps(data))
            return True

    # Hủy lời mời kết bạn
    def cancelFriendRequest(self, connection, username, friendUsername):
        dataVals = connection.hvals("Friends")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['username']==friendUsername and val['friendUsername']==username and val['status']==FriendStatus.REQUESTFRIEND.value):
                del val['status']
                connection.hdel("Friends", json.dumps(val))
                return

    # Chấp nhận lời mời kết bạn của nhau & tạo ra phòng chat cho nhau
    def acceptFriendRequest(self, connection, username, friendUsername):
        key = {
            'username': friendUsername,
            'friendUsername': username
        }
        data = connection.hget("Friends", json.dumps(key))
        data = data.decode("utf-8")
        data = json.loads(data)
        if (data['status']==FriendStatus.REQUESTFRIEND.value):
            data['status'] = FriendStatus.ISFRIEND.value
            connection.hset("Friends", json.dumps(key), json.dumps(data))
        roomid = REDIS.createNewChatRoom(self, connection, username, friendUsername)
        return roomid

    # Unfriend (Xóa toàn bộ dữ liệu giữa 2 người: Participants, Messages, ChatRooms, Friends)
    def unfriend(self, connection, myUsername, myRoomFriend, roomid):
        dataKeys = connection.hkeys("Participants")
        for ele in dataKeys:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomid):
                connection.hdel("Participants", json.dumps(val))

        dataVals = connection.hvals("Messages")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomid):
                connection.hdel("Messages", val['messageID'])

        connection.hdel("ChatRooms", roomid)

        dataVals = connection.hvals("Friends")
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if ((val['username']==myUsername and val['friendUsername']==myRoomFriend) or (val['username']==myRoomFriend and val['friendUsername']==myUsername)):
                del val['status']
                connection.hdel("Friends", json.dumps(val))

    # Lấy toàn bộ nội dung chat thuộc về 1 phòng (Room/Group) nào đó
    # Xếp giảm dần (tin nhắn cũ ở trên, tin nhắn mới ở dưới cùng)
    def getAllMessages(self, connection, roomID):
        dataVals = connection.hvals("Messages")
        result = []
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID):
                value = []
                value.append(val['authorID'])
                value.append(val['content'])
                value.append(val['createAt'])
                result.append(value)
        result.sort(key = takeThird)
        return result

    # Lưu tin nhắn xuống CSDL
    def saveMessage(self, connection, roomID, authorID, content, createAt):
        msgID = str(uuid.uuid4())
        data = {
            'roomID': roomID,
            'messageID': msgID,
            'authorID': authorID,
            'content': content,
            'createAt': str(createAt)
        }
        connection.hset("Messages", msgID, json.dumps(data))

    # Chat group: Lấy thông tin tác giả - người gửi tin nhắn gần đây nhất
    def getNewestMsgInfoOfGroup(self, connection, roomID):
        dataVals = connection.hvals("Messages")
        result = []
        for ele in dataVals:
            val = ele.decode("utf-8")
            val = json.loads(val)
            if (val['roomID']==roomID):
                value = []
                value.append(val['roomID'])
                value.append(val['messageID'])
                value.append(val['authorID'])
                value.append(val['content'])
                value.append(val['createAt'])
                result.append(value)
        result.sort(key = takeFour, reverse = True)
        if (len(result) == 0):
            return None
        return result[0]


    