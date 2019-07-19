# Socket & Flask
from threading import Lock
from flask import Flask, render_template, session, request, copy_current_request_context, redirect, g, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

# Datetime
from datetime import timedelta, datetime

# import decimal & json
from decimal import *
import json

# Import folder Model & database
import sys
sys.path.append('./model')
import DB_Factory

#-------------------------------------------------------------------------------------------------

# Định nghĩa các giá trị của typeMailBox
# typeMailBox = 0: Đây là tin nhắn hiển thị thông thường trên trang cá nhân
# typeMailBox = 1: Đây là tin nhắn hiển thị NHẬN YÊU CẦU KẾT BẠN từ người khác
# typeMailBox = 2: Đây là tin nhắn hiển thị YÊU CẦU KẾT BẠN ĐƯỢC CHẤP NHẬN bởi người khác
# typeMailBox = 3: Đây là tin nhắn hiển thị ĐƯỢC THÊM VÀO GROUP từ người khác (Cập nhật Contact List)
# typeMailBox = 4: Đây là tin nhắn hiển thị TÊN PHÒNG ĐƯỢC THAY ĐỔI bởi người khác
# typeMailBox = 5: Chấm dứt bạn bè của bên A và bên B
# typeMailBox = 6: A thông báo đến B (tác giả) là tại phòng X, A đã xem/nhận được tin nhắn của B

#-------------------------------------------------------------------------------------------------

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

# Khởi tạo loại DATABASE mà mình cần sử dụng (Redis hoặc MySQL) dựa theo Factory Pattern
FAC = DB_Factory.DB_Factory()
DB = FAC.chooseTypeOfDB("MySQL") #Hoặc "Redis"

#-------------------------------------------------------------------------------------------------

@app.route('/')
def redirectToLoginURL():  
    return redirect('/login')

@app.before_request
def before_request():
    g.username = None
    if ('username' in session):
        g.username = session['username']

@app.route('/login')
def renderLoginPage():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return render_template('login.html', loginMsg='Can not connect to server now')
        DB.closeConnectToDB(connection)
        return redirect('/dashboard')

    return render_template('login.html')

@app.route('/login', methods=['POST'])
def checkLogin():
    session.pop('username', None)

    connection = DB.connectToDB()
    if (connection == None):
        return render_template('login.html', loginMsg='Can not connect to server now')
    
    # Nếu username là available (chưa tồn tại) trong CSDL => Username does not exist => Login fail
    username = request.form['username']
    if (DB.isAvailableUsername(connection, username)):
        DB.closeConnectToDB(connection)
        return render_template('login.html', loginMsg='Username does not exist')

    password = request.form['password']
    if not (DB.checkLoginAccount(connection, username, password)):
        DB.closeConnectToDB(connection)
        return render_template('login.html', loginMsg='Password is uncorrect', usernameValue=username)

    infoAccount = DB.getAccountInfo(connection, username);
    if (infoAccount[4] == -1):
        return render_template('login.html', loginMsg='Account is deactive')

    DB.updateOnlineStatus(connection, username)

    DB.closeConnectToDB(connection)

    # Bật session dài hạn (ở đây "timedelta(hours=2)")
    session.permanent = True 
    app.permanent_session_lifetime = timedelta(hours=2)
    session['username'] = username

    return redirect('/dashboard')

@app.route('/dashboard')
def renderDashboardPage():
    if g.username:
        return render_template('dashboard.html', myUsername=session['username'])
    
    return redirect('/login')

@app.route('/logout')
def logout():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        DB.updateOfflineStatus(connection, session['username'])

        DB.closeConnectToDB(connection)
        session.pop('username', None)

    return redirect('/login')

@app.route('/register')
def renderRegisterPage():
    if g.username:
        return redirect('/login')
    return render_template('register.html', registerMsg="Welcome to ChatApp")

@app.route('/register', methods=['POST'])
def checkRegister():
    connection = DB.connectToDB()
    if (connection == None):
        return render_template('register.html', registerMsg='Can not connect to server now')

    # Nếu username không available (đã tồn tại username này) trong CSDL => Đăng ký tài khoản thất bại
    username = request.form['username']
    if not (DB.isAvailableUsername(connection, username)):
        DB.closeConnectToDB(connection)
        return render_template('register.html', registerMsg="Registered fail, username existed")

    password = request.form['password']
    email = request.form['email']
    phone = int(request.form['phone'])

    DB.createNewAccount(connection, username, password, email, phone)

    DB.closeConnectToDB(connection)
    return render_template('register.html', registerMsg="Registered account successfully, you can login now")

@app.route('/activateAccount')
def renderActivationPage():
    if g.username:
        return redirect('/login')
    return render_template('activateAccount.html', activateMsg="Only activate account which was deactive before")

@app.route('/activateAccount', methods=['POST'])
def checkActivation():
    connection = DB.connectToDB()
    if (connection == None):
        return render_template('activateAccount.html', activateMsg='Can not connect to server now')

    # Nếu username là available (chưa tồn tại) trong CSDL => Username does not exist => Activate fail
    username = request.form['username']
    if (DB.isAvailableUsername(connection, username)):
        DB.closeConnectToDB(connection)
        return render_template('activateAccount.html', activateMsg='Username does not exist')

    password = request.form['password']
    if not (DB.checkLoginAccount(connection, username, password)):
        DB.closeConnectToDB(connection)
        return render_template('activateAccount.html', activateMsg='Password is uncorrect', usernameValue=username)

    account = DB.getAccountInfo(connection, username)
    if (account[4] == -1):
        DB.activateAccount(connection, username)
 
    DB.closeConnectToDB(connection)
    return render_template('activateAccount.html', activateMsg='Your account is active now')

@app.route('/dashboard/deactiveAccount', methods=['POST'])
def deactiveAccount():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        DB.deactiveAccount(connection, session['username'])

        DB.closeConnectToDB(connection)
        session.pop('username', None)

    return redirect('/login')

@app.route('/viewprofile')
def renderViewProfilePage():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        infoAccount = DB.getAccountInfo(connection, session['username'])

        DB.closeConnectToDB(connection)
        return render_template('viewProfile.html', ProUsername=infoAccount[0], ProEmail=infoAccount[2], ProPhone=("0"+str(infoAccount[3])), ProCreateAt=infoAccount[5], ProUpdatedAt=infoAccount[6])
    
    return redirect('/login')

@app.route('/viewprofile/editphone', methods=['POST'])
def updatePhoneProfile():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        phone = request.form['phone']
        DB.updatePhone(connection, session['username'], int(phone))
        DB.updateUpdateAt(connection, session['username'])

        DB.closeConnectToDB(connection)
        return redirect('/viewprofile')
    
    return redirect('/login')

@app.route('/viewprofile/editemail', methods=['POST'])
def updateEmailProfile():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        email = request.form['email']
        DB.updateEmail(connection, session['username'], email)
        DB.updateUpdateAt(connection, session['username'])

        DB.closeConnectToDB(connection)
        return redirect('/viewprofile')
    
    return redirect('/login')

@app.route('/viewprofile/editpassword', methods=['POST'])
def updatePasswordProfile():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        newPassword = request.form['newPassword']
        DB.updatePassword(connection, session['username'], newPassword)
        DB.updateUpdateAt(connection, session['username'])

        DB.closeConnectToDB(connection)
        session.pop('username', None)
        return redirect('/login')
    
    return redirect('/login')

@app.route('/dashboard/addNewFriend', methods=['POST'])
def addNewFriend():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        newFriendUsername = request.form['newFriendUsername']
        checkNFU = DB.isAvailableUsername(connection, newFriendUsername)
        if checkNFU:
            # Username nhập vào không tồn tại
            DB.closeConnectToDB(connection)
            message = "[ERROR] Username [" + newFriendUsername + "] does not exist"
            socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard') 
        else:
            resultQuery = DB.requestFriend(connection, session['username'], newFriendUsername)
            if not resultQuery:
                # 2 người đã là bạn của nhau, gửi yêu cầu kết bạn thất bại
                DB.closeConnectToDB(connection)
                message = "Both are friends before or friend request has been sent, can not add [" + newFriendUsername + "] anymore"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard') 
            else:
                # Gửi yêu cầu kết bạn đến đối phương thành công
                DB.closeConnectToDB(connection)
                message = "Your friend request has been sent to " + newFriendUsername
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard')
                socketio.emit('personalMailBox', {'friendRequestUsername': session['username'], 'typeMailBox': 1}, room=newFriendUsername, namespace='/dashboard') 

    return redirect('/login')

@app.route('/dashboard/rejectFriend/<name>', methods=['POST'])
def rejectFriendRequest(name):
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        DB.cancelFriendRequest(connection, session['username'], name)

        DB.closeConnectToDB(connection)

    return redirect('/login')  

@app.route('/dashboard/acceptFriend/<name>', methods=['POST'])
def acceptFriendRequest(name):
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        roomid = DB.acceptFriendRequest(connection, session['username'], name)
        userInfo = DB.getAccountInfo(connection, name)

        DB.closeConnectToDB(connection)

        socketio.emit('personalMailBox', {'roomID': roomid, 'username': session['username'], 'userStatusInfo': 1, 'typeMailBox': 2}, room=name, namespace='/dashboard')
        socketio.emit('personalMailBox', {'roomID': roomid, 'username': name, 'userStatusInfo': userInfo[4], 'typeMailBox': 2}, room=session['username'], namespace='/dashboard')

    return redirect('/login')  

@app.route('/dashboard/changeRoomName/<roomid>/<roomname>', methods=['POST'])
def changeRoomName(roomid, roomname):
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')
        
        oldRoomName = DB.getRoomName(connection, roomid)
        roomType = DB.getRoomType(connection, roomid)
        DB.updateRoomName(connection, roomid, roomname)
        partsInfo = DB.findFriendsInMyGroup(connection, session['username'], roomid)

        DB.closeConnectToDB(connection)
        message = session['username'] + " changed room name from [" + oldRoomName + "] to [" + roomname + "] successfully"
        socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard')
        socketio.emit('personalMailBox', {'roomid': roomid, 'newRoomName': roomname, 'roomType': roomType, 'typeMailBox': 4}, room=session['username'], namespace='/dashboard')
        for ele in partsInfo:
            socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=ele[0], namespace='/dashboard')
            socketio.emit('personalMailBox', {'roomid': roomid, 'newRoomName': roomname, 'roomType': roomType, 'typeMailBox': 4}, room=ele[0], namespace='/dashboard')

    return redirect('/login')

@app.route('/dashboard/unfriend/<roomid>', methods=['POST'])
def unfriend(roomid):
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')
        
        myRoomFriend = DB.findFriendInMyRoom(connection, session['username'], roomid)
        friendUsername = myRoomFriend[0]
        DB.unfriend(connection, session['username'], friendUsername, roomid)

        DB.closeConnectToDB(connection)
        socketio.emit('personalMailBox', {'roomid': roomid, 'typeMailBox': 5}, room=session['username'], namespace='/dashboard')
        socketio.emit('personalMailBox', {'roomid': roomid, 'typeMailBox': 5}, room=friendUsername, namespace='/dashboard')

    return redirect('/login')

@app.route('/dashboard/createNewGroup', methods=['POST'])
def createNewGroup():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        dataOfAjax = request.get_json('friendsForGroup')
        ffg = dataOfAjax['friendsForGroup']
        dataOfAjax = request.get_json('newGroupName')
        roomName = dataOfAjax['newGroupName']
        roomid = DB.createNewChatGroup(connection, ffg, roomName)

        DB.closeConnectToDB(connection)
        for ele in ffg:
            socketio.emit('personalMailBox', {'roomID': roomid, 'roomName': roomName, 'typeMailBox': 3}, room=ele, namespace='/dashboard')

    return redirect('/login')

@app.route('/dashboard/leaveGroup', methods=['POST'])
def leaveGroup():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')
        
        dataOfAjax = request.get_json('roomID')
        roomID = dataOfAjax['roomID']
        dataOfAjax = request.get_json('myUsername')
        myUsername = dataOfAjax['myUsername']

        groupMembers = DB.getAllPartsInfo(connection, roomID)
        if (len(groupMembers) == 1):
            # Nếu group còn đúng 1 người mà ng đó leave group thì xóa toàn bộ dữ liệu liên quan đến group đó
            DB.deleteGroup(connection, roomID)
        else:
            # Group còn >1 người, leave group bình thường
            DB.leaveGroup(connection, myUsername, roomID)

        DB.closeConnectToDB(connection)
        for ele in groupMembers:
            if not (ele[0] == myUsername):
                message = "[NOTICE] Username [" + myUsername + "] left this group"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=ele[0], namespace='/dashboard') 

    return redirect('/login')

@app.route('/dashboard/addToGroup', methods=['POST'])
def addFriendToGroup():
    if g.username:
        connection = DB.connectToDB()
        if (connection == None):
            return redirect('/login')

        dataOfAjax = request.get_json('roomID')
        roomID = dataOfAjax['roomID'] #Phòng này là phòng cá nhân (bạn bè), chứ không phải groupID
        dataOfAjax = request.get_json('myUsername')
        myUsername = dataOfAjax['myUsername']
        dataOfAjax = request.get_json('groupName')
        groupName = dataOfAjax['groupName']

        roomResult = DB.checkNameOfMyGroupList(connection, myUsername, groupName)
        if (roomResult == None): #Nếu tên phòng group không tồn tại
            DB.closeConnectToDB(connection)
            message = "[NOTICE] Group name [" + groupName + "] does not exist, can not add your friend to group"
            socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=myUsername, namespace='/dashboard')
        else: #Nếu tên phòng group tồn tại
            myFriend = DB.findFriendInMyRoom(connection, myUsername, roomID)
            myFriendUsername = myFriend[0]
            addResult = DB.addMemberToChatGroup(connection, myFriendUsername, roomResult[0])
            DB.closeConnectToDB(connection)
            if (addResult == True): #Thêm thành công
                message = "[NOTICE] You added [" + myFriendUsername + "] to group [" + groupName + "] successfully"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=myUsername, namespace='/dashboard')
                message = "[NOTICE] You added to group [" + groupName + "] by [" + myUsername + "]"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=myFriendUsername, namespace='/dashboard')
                socketio.emit('personalMailBox', {'roomID': roomResult[0], 'roomName': groupName, 'typeMailBox': 3}, room=myFriendUsername, namespace='/dashboard')

            else: # Thêm thất bại vì friend đã trong group từ trước
                message = "[NOTICE] Your friend [" + myFriendUsername + "] was in group, can not add anymore"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=myUsername, namespace='/dashboard')

    return redirect('/login')





#-------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------





def background_thread():
    while True:
        socketio.sleep(10)

@socketio.on('connect', namespace='/dashboard')
def socketConnect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)

    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    # Tham gia vào room có username của chính mình để làm PERSONAL MAIL BOX
    # Ng khác sẽ gửi Yêu cầu kết bạn, thêm vào group, chấp nhận kết bạn, thay đổi tên phòng chat,...
    join_room(session['username'])

    userArray = DB.getFriendList(connection, session['username'])
    activeArray = None
    roomArray = None
    if not (len(userArray) == 0):
        activeArray = DB.getActiveList(connection, userArray)
        roomArray = DB.getRoomOfFriends(connection, session['username'], userArray)
    groupArray = DB.getMyGroups(connection, session['username'])

    DB.closeConnectToDB(connection)

    # Tham gia toàn bộ phòng chat Friend List
    if not (roomArray == None):
        for ele in roomArray:
            join_room(str(ele[1]))
    
    # Tham gia toàn bộ group chat mà mình tham gia
    if not (groupArray == None):
        for ele in groupArray:
            join_room(str(ele[0]))
    
    emit('renderContactListFirstTime', {'userData': activeArray, 'roomData': roomArray, 'groupData': groupArray})

@socketio.on('chooseChatRoom', namespace='/dashboard')
def chooseChatRoom(message):
    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    roomID = message['roomid']
    roomType = DB.getRoomType(connection, roomID)
    roomName = DB.getRoomName(connection, roomID)
    messageArray = DB.getAllMessages(connection, roomID)
    DB.updateSeenMessage(connection, session['username'], roomID) # Cập nhật bản thân đã seen toàn bộ tin nhắn trong phòng này

    if (roomType == 0): #Phòng bạn bè của nhau
        myFriendInSameRoom = DB.findFriendInMyRoom(connection, session['username'], roomID)  
        accInfo = DB.getAccountInfo(connection, myFriendInSameRoom[0])
        DB.closeConnectToDB(connection)
        emit('renderChoosedChatRoom', {'messageArray': messageArray, 'userStatusInfo': accInfo[4], 'myFriendInSameRoom': myFriendInSameRoom, 'roomType': roomType, 'roomName': roomName, 'roomID': roomID}) 
    else: #Phòng nhóm
        totalMessages = DB.sumAllMsgInGroup(connection, session['username'], roomID)
        myMsgIsSeen = DB.checkMsgIsSeenInGroup(connection, session['username'], roomID)
        newestMsgInfoOfGroup = DB.getNewestMsgInfoOfGroup(connection, roomID)
        DB.closeConnectToDB(connection)
        if (newestMsgInfoOfGroup == None):
            newestAuthor = None
        else:
            newestAuthor = newestMsgInfoOfGroup[2]
        emit('renderChoosedChatGroup', {'messageArray': messageArray, 'totalMessages': str(totalMessages), 'myMsgIsSeen': myMsgIsSeen, 'roomType': roomType, 'roomName': roomName, 'roomID': roomID, 'authorID': newestAuthor}) 
        

@socketio.on('chatTogether', namespace='/dashboard')
def chatTogether(message):
    roomID = message['roomid']
    authorID = message['authorid']
    content = message['content']
    createAt = datetime.now()
    
    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    DB.saveMessage(connection, roomID, authorID, content, createAt)
    DB.updateUnseenMessage(connection, roomID) # Cập nhật toàn bộ thành viên trong phòng là unseen (kể cả mình)
    DB.updateSeenMessage(connection, authorID, roomID) # Cập nhật tác giả đã seen message của mình
    DB.plus1TotalMessage(connection, authorID, roomID) # Tăng 1 total message của mình ở roomID

    # Lấy totalMessages
    roomType = DB.getRoomType(connection, roomID)
    totalMessages = 0
    allPartsInfo = None
    if (roomType == 0):
        partInfo = DB.getPartInfo(connection, authorID, roomID) 
        DB.closeConnectToDB(connection)
        totalMessages = partInfo[3]
    else:
        # Vì group không dễ dàng tính totalMessages như room (chỉ có 2 người: tác giả và người nhận).
        # Do đó, gửi nguyên danh sách member cùng room về từng client và ở client sẽ tự tính.
        # Lấy phần tử thứ 0 (username) và 3 (totalMessages) để so khớp và tính totalMessages.
        # Phía client sẽ dựa vào roomType, nếu là 0 thì dùng giá trị totalMessages, nếu là 1 thì tự tính dựa trên allPartsInfo.
        allPartsInfo = DB.getAllPartsInfo(connection, roomID)
        DB.closeConnectToDB(connection)

    emit('responseChatTogether',
         {'content': message['content'], 'roomID': roomID, 'timeCreateAt': str(createAt).split('.')[0], 'authorid': authorID, 'totalMessages': str(totalMessages), 'roomType': roomType, 'allPartsInfo': allPartsInfo}, room=str(roomID))

@socketio.on('noticeSeenMsgToAuthor', namespace='/dashboard')
def seenMessage(message):
    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    roomID = message['roomID']
    authorID = message['authorID']
    myUsername = message['myUsername']

    # Cập nhật StatusMsg thành SEEN cho NGƯỜI NHẬN ĐƯỢC TIN NHẮN & ĐÃ XEM từ tác giả (người gửi)
    DB.updateSeenMessage(connection, myUsername, roomID)

    DB.closeConnectToDB(connection)
    emit('personalMailBox', {'roomid': roomID, 'typeMailBox': 6}, room=authorID)

@socketio.on('requestRenderFRL', namespace='/dashboard')
def renderFRL():
    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    frl = DB.getFriendRequestList(connection, session['username'])

    DB.closeConnectToDB(connection)
    emit('renderFRL', {'friendRequestUsernameArray': frl})

@socketio.on('join_room', namespace='/dashboard')
def joinRoom(message):
    roomID = message['roomid']
    join_room(str(roomID))

@socketio.on('requestRenderFL', namespace='/dashboard')
def renderFL():
    connection = DB.connectToDB()
    if (connection == None):
        return redirect('/login')

    fl = DB.getFriendList(connection, session['username'])

    DB.closeConnectToDB(connection)
    emit('renderFL', {'friendUsernameArray': fl})


#-------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    socketio.run(app, debug=True)

# Ref:
# + https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
# + https://flask-socketio.readthedocs.io/en/latest/
# + https://github.com/miguelgrinberg/Flask-SocketIO