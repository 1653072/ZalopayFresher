# Socket & Flask
from threading import Lock
from flask import Flask, render_template, session, request, copy_current_request_context, redirect, g, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

# Datetime
from datetime import timedelta, datetime

# Model
import sys
sys.path.append('./model')
import connectDB, accountDB, chatroomDB, friendDB, messageDB

# Định nghĩa các giá trị của typeMailBox
# typeMailBox = 0: Đây là tin nhắn hiển thị thông thường trên trang cá nhân
# typeMailBox = 1: Đây là tin nhắn hiển thị NHẬN YÊU CẦU KẾT BẠN từ người khác
# typeMailBox = 2: Đây là tin nhắn hiển thị YÊU CẦU KẾT BẠN ĐƯỢC CHẤP NHẬN bởi người khác
# typeMailBox = 3: Đây là tin nhắn hiển thị ĐƯỢC THÊM VÀO GROUP từ người khác
# typeMailBox = 4: Đây là tin nhắn hiển thị TÊN PHÒNG ĐƯỢC THAY ĐỔI bởi người khác

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
        connection = connectDB.connectToDB()
        if (connection == None):
            return render_template('login.html', loginMsg='Can not connect to server now')

        connectDB.closeConnectToDB(connection)
        return redirect('/dashboard')

    return render_template('login.html')

@app.route('/login', methods=['POST'])
def checkLogin():
    session.pop('username', None)

    connection = connectDB.connectToDB()
    if (connection == None):
        return render_template('login.html', loginMsg='Can not connect to server now')

    # Nếu username là available (chưa tồn tại) trong CSDL => Username does not exist => Login fail
    username = request.form['username']
    if (accountDB.isAvailableUsername(connection, username)):
        connectDB.closeConnectToDB(connection)
        return render_template('login.html', loginMsg='Username does not exist')

    password = request.form['password']
    if not (accountDB.checkLoginAccount(connection, username, password)):
        connectDB.closeConnectToDB(connection)
        return render_template('login.html', loginMsg='Password is uncorrect', usernameValue=username)

    infoAccount = accountDB.getAccountInfo(connection, username);
    if (infoAccount[4] == -1):
        return render_template('login.html', loginMsg='Account is deactive')

    accountDB.updateOnlineStatus(connection, username)

    connectDB.closeConnectToDB(connection)

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
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        accountDB.updateOfflineStatus(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        session.pop('username', None)

    return redirect('/login')

@app.route('/register')
def renderRegisterPage():
    if g.username:
        return redirect('/login')
    return render_template('register.html', registerMsg="Welcome to ChatApp")

@app.route('/register', methods=['POST'])
def checkRegister():
    connection = connectDB.connectToDB()
    if (connection == None):
        return render_template('register.html', registerMsg='Can not connect to server now')

    # Nếu username không available (đã tồn tại username này) trong CSDL => Đăng ký tài khoản thất bại
    username = request.form['username']
    if not (accountDB.isAvailableUsername(connection, username)):
        connectDB.closeConnectToDB(connection)
        return render_template('register.html', registerMsg="Registered fail, username existed")

    password = request.form['password']
    email = request.form['email']
    phone = int(request.form['phone'])

    accountDB.createNewAccount(connection, username, password, email, phone)

    connectDB.closeConnectToDB(connection)
    return render_template('register.html', registerMsg="Registered account successfully, you can login now")

@app.route('/activateAccount')
def renderActivationPage():
    if g.username:
        return redirect('/login')
    return render_template('activateAccount.html', activateMsg="Only activate account which was deactive before")

@app.route('/activateAccount', methods=['POST'])
def checkActivation():
    connection = connectDB.connectToDB()
    if (connection == None):
        return render_template('activateAccount.html', activateMsg='Can not connect to server now')

    # Nếu username là available (chưa tồn tại) trong CSDL => Username does not exist => Activate fail
    username = request.form['username']
    if (accountDB.isAvailableUsername(connection, username)):
        connectDB.closeConnectToDB(connection)
        return render_template('activateAccount.html', activateMsg='Username does not exist')

    password = request.form['password']
    if not (accountDB.checkLoginAccount(connection, username, password)):
        connectDB.closeConnectToDB(connection)
        return render_template('activateAccount.html', activateMsg='Password is uncorrect', usernameValue=username)

    account = accountDB.getAccountInfo(connection, username)
    if (account[4] == -1):
        accountDB.activateAccount(connection, username)
 
    connectDB.closeConnectToDB(connection)
    return render_template('activateAccount.html', activateMsg='Your account is active now')

@app.route('/dashboard/deactiveAccount', methods=['POST'])
def deactiveAccount():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        accountDB.deactiveAccount(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        session.pop('username', None)

    return redirect('/login')

@app.route('/viewprofile')
def renderViewProfilePage():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        infoAccount = accountDB.getAccountInfo(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        return render_template('viewProfile.html', ProUsername=infoAccount[0], ProEmail=infoAccount[2], ProPhone=("0"+str(infoAccount[3])), ProCreateAt=infoAccount[5], ProUpdatedAt=infoAccount[6])
    
    return redirect('/login')

@app.route('/viewprofile/editphone', methods=['POST'])
def updatePhoneProfile():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        phone = request.form['phone']
        accountDB.updatePhone(connection, session['username'], int(phone))
        accountDB.updateUpdateAt(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        return redirect('/viewprofile')
    
    return redirect('/login')

@app.route('/viewprofile/editemail', methods=['POST'])
def updateEmailProfile():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        email = request.form['email']
        accountDB.updateEmail(connection, session['username'], email)
        accountDB.updateUpdateAt(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        return redirect('/viewprofile')
    
    return redirect('/login')

@app.route('/viewprofile/editpassword', methods=['POST'])
def updatePasswordProfile():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        newPassword = request.form['newPassword']
        accountDB.updatePassword(connection, session['username'], newPassword)
        accountDB.updateUpdateAt(connection, session['username'])

        connectDB.closeConnectToDB(connection)
        session.pop('username', None)
        return redirect('/login')
    
    return redirect('/login')

@app.route('/dashboard/addNewFriend', methods=['POST'])
def addNewFriend():
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        newFriendUsername = request.form['newFriendUsername']
        checkNFU = accountDB.isAvailableUsername(connection, newFriendUsername)
        if checkNFU:
            # Username nhập vào không tồn tại
            connectDB.closeConnectToDB(connection)
            message = "[ERROR] Username " + newFriendUsername + " does not exist"
            socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard') 
        else:
            resultQuery = friendDB.requestFriend(connection, session['username'], newFriendUsername)
            if not resultQuery:
                # 2 người đã là bạn của nhau, gửi yêu cầu kết bạn thất bại
                connectDB.closeConnectToDB(connection)
                message = "Both are friends before or friend request has been sent, can not add " + newFriendUsername + " anymore"
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard') 
            else:
                # Gửi yêu cầu kết bạn đến đối phương thành công
                connectDB.closeConnectToDB(connection)
                message = "Your friend request has been sent to " + newFriendUsername
                socketio.emit('personalMailBox', {'content': message, 'typeMailBox': 0}, room=session['username'], namespace='/dashboard')
                socketio.emit('personalMailBox', {'friendRequestUsername': session['username'], 'typeMailBox': 1}, room=newFriendUsername, namespace='/dashboard') 

    return redirect('/login')

@app.route('/dashboard/rejectFriend/<name>', methods=['POST'])
def rejectFriendRequest(name):
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        friendDB.cancelFriendRequest(connection, session['username'], name)

        connectDB.closeConnectToDB(connection)

    return redirect('/login')  

@app.route('/dashboard/acceptFriend/<name>', methods=['POST'])
def acceptFriendRequest(name):
    if g.username:
        connection = connectDB.connectToDB()
        if (connection == None):
            return redirect('/login')

        roomid = friendDB.acceptFriendRequest(connection, session['username'], name)
        userInfo = accountDB.getAccountInfo(connection, session['username'])

        connectDB.closeConnectToDB(connection)

        username = userInfo[0]
        userStatusInfo = userInfo[4]

        socketio.emit('personalMailBox', {'roomID': roomid, 'username': username, 'userStatusInfo': userStatusInfo, 'typeMailBox': 2}, room=name, namespace='/dashboard')

    return redirect('/login')  








# @app.route('/getsession')
# def getsession():
#     if 'username' in session:
#         return session['username']

# @app.route('/dropsession')
# def dropsession():
#     session.pop('username', None)
#     return





















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

    connection = connectDB.connectToDB()
    if (connection == None):
        return redirect('/login')

    # Tham gia vào room có username của chính mình để làm PERSONAL MAIL BOX
    # Ng khác sẽ gửi Yêu cầu kết bạn, thêm vào group, chấp nhận kết bạn, thay đổi tên phòng chat,...
    join_room(session['username'])

    userArray = friendDB.getFriendList(connection, session['username'])
    if (len(userArray) == 0):
        connectDB.closeConnectToDB(connection)
        return redirect('/login')
    activeArray = accountDB.getActiveList(connection, userArray)
    roomArray = chatroomDB.getRoomOfFriends(connection, session['username'], userArray)

    connectDB.closeConnectToDB(connection)

    # Tham gia toàn bộ phòng chat Friend List
    for ele in roomArray:
        join_room(str(ele[1]))
    
    emit('renderFriendListFirstTime', {'userData': activeArray, 'roomData': roomArray})

@socketio.on('chooseChatRoom', namespace='/dashboard')
def chooseChatRoom(message):
    connection = connectDB.connectToDB()
    if (connection == None):
        return redirect('/login')

    roomID = message['roomid']
    roomType = chatroomDB.getRoomType(connection, roomID)
    roomName = chatroomDB.getRoomName(connection, roomID)
    messageArray = messageDB.getAllMessages(connection, roomID)
    chatroomDB.updateSeenMessage(connection, session['username'], roomID) # Cập nhật bản thân đã seen
    if (roomType == 0):
        myFriendInSameRoom = chatroomDB.findFriendInMyRoom(connection, session['username'], roomID)        
        partInfo = chatroomDB.getOnePartInfo(connection, myFriendInSameRoom[0], roomID)
        accInfo = accountDB.getAccountInfo(connection, partInfo[0])
        connectDB.closeConnectToDB(connection)
        totalMessages = partInfo[3]
        emit('renderChoosedChatRoom', {'messageArray': messageArray, 'userStatusInfo': accInfo[4], 'totalMessages': totalMessages, 'roomType': roomType, 'roomName': roomName}) 
    else:
        # Do something here for CHAT GROUP
        connectDB.closeConnectToDB(connection)
        return redirect('/login')

@socketio.on('chatTogether', namespace='/dashboard')
def chatTogether(message):
    roomID = message['roomid']
    authorID = message['authorid']
    content = message['content']
    createAt = datetime.now()
    
    connection = connectDB.connectToDB()
    if (connection == None):
        return redirect('/login')

    messageDB.saveMessage(connection, roomID, authorID, content, createAt)
    chatroomDB.updateUnseenMessage(connection, roomID) # Cập nhật toàn bộ thành viên trong phòng là unseen (kể cả mình)
    chatroomDB.plus1TotalMessage(connection, authorID, roomID) # Tăng 1 total message của mình ở roomID

    # Lấy totalMessages
    roomType = chatroomDB.getRoomType(connection, roomID)
    totalMessages = 0
    if (roomType == 0):
        partInfo = chatroomDB.getOnePartInfo(connection, authorID, roomID) 
        connectDB.closeConnectToDB(connection)
        totalMessages = partInfo[3]
    else:
        partsInfo = chatroomDB.getMorePartsInfo(connection, session['username'], roomID) 
        connectDB.closeConnectToDB(connection)
        for ele in partsInfo:
            totalMessages += ele[3]

    emit('responseChatTogether',
         {'content': message['content'], 'roomID': roomID, 'timeCreateAt': str(createAt).split('.')[0], 'authorid': authorID, 'totalMessages': totalMessages}, room=str(roomID))

@socketio.on('requestRenderFRL', namespace='/dashboard')
def renderFRL():
    connection = connectDB.connectToDB()
    if (connection == None):
        return redirect('/login')

    frl = friendDB.getFriendRequestList(connection, session['username'])

    connectDB.closeConnectToDB(connection)
    emit('renderFRL', {'friendRequestUsernameArray': frl})

@socketio.on('join_room', namespace='/dashboard')
def joinRoom(message):
    roomID = message['roomid']
    join_room(str(roomID))

# @socketio.on('seen_message', namespace='/dashboard')
@socketio.on('seen_message', namespace='/dashboard')
def seenMessage(message):
    connection = connectDB.connectToDB()
    if (connection == None):
        return redirect('/login')

    roomID = message['roomid']
    chatroomDB.updateSeenMessage(connection, session['username'], roomID)

    connectDB.closeConnectToDB(connection)


















#-------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    socketio.run(app, debug=True)

# Ref:
# + https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
# + https://flask-socketio.readthedocs.io/en/latest/
# + https://github.com/miguelgrinberg/Flask-SocketIO