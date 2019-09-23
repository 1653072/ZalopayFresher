const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const server = require('http').Server(app)
let io = require('socket.io')(server);
let service = require('./service/service');
var cors = require('cors')
var corsOptions = {
   origin: 'http://localhost:3000'
}
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// ---------------------------------------------------------------------------
// -------------------------------RESTFUL API---------------------------------
// ---------------------------------------------------------------------------



// Request: username | password
// Response: code 200 (token) | code 404 (fail)
app.options('/login', cors())
app.post('/login', cors(corsOptions), async (req, res) => {
   username = req.body.username
   password = req.body.password;

   result = await service.checkLogin(username, password)
   
   if (result) {
      res.status(200).json({token: result})
   }
   else {
      res.status(400).json({message: "Username or password is wrong" })
   }
})

// Request: token, logout
// Response: msg error or success
app.options('/logout', cors())
app.post('/logout', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization

   result = await service.addTokenToBLJWT(token)
   if (!result) {
      res.status(404).json({message: "Wrong token, logout fail" })
      return
   }
  
    res.status(200).json({message: "Logout successfully" })
})

// Request: username, password, email, displayedName
// Response: msg error or success
app.options('/register', cors())
app.post('/register', cors(corsOptions), async (req, res) => {
   username = req.body.username
   password = req.body.password
   email = req.body.email
   displayedName = req.body.displayedName

   if (! (await service.isUniqueUsername(username))) {
      res.status(400).json({ message: "This username existed, please choose another" })
      return
   }

   if (! (await service.isUniqueEmail(email))) {
      res.status(400).json({message: "This email existed, please choose another" })
      return
   }

   avatar = service.randomAvatar()

   result = await service.addNewUser(username, password, email, displayedName, avatar)
   if (result == null) {
      res.status(500).json({message: "Server registered new account fail" })
      return
   }

   await service.updatePointsLB(username, 0)

   res.status(200).json({message: "Register new account successfully" })
})

// Request: token
// Response: listGameRoom
app.options('/gameroom/all', cors())
app.get('/gameroom/all', cors(corsOptions), cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   
   listGameRoom = await service.getInfoAllGameRoom(token)
   if (listGameRoom==null || listGameRoom==[]) {
      res.status(200).json({listGameRoom: []})
      return  
   }

   if (listGameRoom == false){
      res.status(400).json({message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({listGameRoom: listGameRoom})
})

// Request: token with URL(/gameroom/one?gid=xxxx)
// Response: GameRoom
app.options('/gameroom/one', cors())
app.get('/gameroom/one', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   gid = req.query.gid

   grInfo = await service.getInfoOneGameRoom(token, gid)
   if (!grInfo) {
      res.status(400).json({ message: "Wrong/Expired token or room not found" })
      return
   }

   res.status(200).json({gameRoom: grInfo})
})

// Request: token, gameroom
// Parameter of "gameroom": JSON gameroom (uuid, room_name, password, bet_points, guest_id, host_id, is_waiting)
// is_waiting {0,1} => 1 means room is playing
app.options('/gameroom', cors())
app.post('/gameroom', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   gameroom = req.body.gameroom
   result = await service.setGameRoom(token, gameroom)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({ message: "Update successfully" })
})

// Request: token, json uuid, json guest_id
app.options('/gameroom/guest', cors())
app.post('/gameroom/guest',cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   uuid = req.body.gid
   guest_id = req.body.guest_id

   result = await service.updateGuestAndStatusGR(token, uuid, guest_id)
   if (!result) {
      res.status(400).json({message: "Wrong/Expired token or room not empty" })
      return
   }

   res.status(200).json({ message: "Update successfully" })
})

// Request: token
// Response: leaderboard
app.options('/leaderboard/top6', cors())
app.get('/leaderboard/top6', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization

   leaderboard = await service.getTop6LB(token)
   if (!leaderboard) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  leaderboard: leaderboard})
})

// Request: token
// Response: leaderboard
app.options('/leaderboard/all', cors())
app.get('/leaderboard/all', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization

   leaderboard = await service.getAllTopLB(token)
   if (!leaderboard) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  leaderboard: leaderboard})
})

// Request: token
// Response: userInfo
app.options('/user', cors())
app.get('/user', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization

   userInfo = await service.getUserInfo(token)
   if (!userInfo) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  userInfo: userInfo})
})

// Request: token, name
// Response: msg error or success
app.options('/user/name', cors())
app.post('/user/name', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   name = req.body.name

   result = await service.updateUserDisplayedName(token, name)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, error
// Response: msg error or success
app.options('/user/email', cors())
app.post('/user/email', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   email = req.body.email

   result = await service.updateUserEmail(token, email)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token or Existed email" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, currentpassword, newpassword 
// Response: msg error or success
app.options('/user/password', cors())
app.post('/user/password', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   curPassword = req.body.currentpassword
   newPassword = req.body.newpassword
   userInfo = await service.getUserInfo(token)
   if (!userInfo) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   if (await service.comparePassword(curPassword, userInfo.password) == false) {
      res.status(400).json({ message: "Current password is wrong" })
      return
   }

   result = await service.updateUserPassword(token, newPassword)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, avatar
// Response: msg error or success
app.options('/user/avatar', cors())
app.post('/user/avatar', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   avatar = req.body.avatar

   result = await service.updateUserAvatar(token, avatar)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, points
// Response: msg error or success
app.options('/user/points', cors())
app.post('/user/points', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   points = req.body.points

   result = await service.updateUserPoints(token, points)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, winnum
// Response: msg error or success
app.options('/user/winnum', cors())
app.post('/user/winnum', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   winnum = req.body.winnum

   result = await service.updateUserWinNum(token, winnum)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token"})
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, drawnum
// Response: msg error or success
app.options('/user/drawnum', cors())
app.post('/user/drawnum', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   drawnum = req.body.drawnum

   result = await service.updateUserDrawNum(token, drawnum)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token" })
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token, losenum
// Response: msg error or success
app.options('/user/losenum', cors())
app.post('/user/losenum', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization
   loseNum = req.body.losenum

   result = await service.updateUserLoseNum(token, losenum)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token"})
      return
   }

   res.status(200).json({  message: "Update successfully" })
})

// Request: token
// Response: JSON(username, ranking)
app.options('/user/ranking', cors())
app.get('/user/ranking', cors(corsOptions), async (req, res) => {
   token = req.headers.authorization

   result = await service.getMyRanking(token)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token"})
      return
   }

   res.status(200).json({  ranking: result })
})

// Request: email:<email>
// Response: Fail | Success
app.options('/resetpassword', cors())
app.post('/resetpassword', cors(corsOptions), async (req, res) => {
   email = req.body.email

   userInfo = await service.getUserInfoByEmailNoToken(email)
   if (!userInfo) {
      res.status(400).json({ message: "Email does not exist"})
      return
   }

   username = '{"username" : "' + userInfo.username + '"}'
   username = JSON.parse(username)
   token = await service.generateJWTExpMinutes(username, 30)
   url = 'http://localhost:3000/resetpassword/' + token

   await service.sendEmail(email, userInfo.username, url)

   res.status(200).json({  message: "Request change password has sent, please check your Email!" })
})

// Request: token with URL(/resetpassword/<token>)
// Response: Fail | username (JSON)
app.options('/resetpassword/:token', cors())
app.get('/resetpassword/:token', cors(corsOptions), async (req, res) => {
   jwt = req.params.token

   checkJWT = await service.verifyJWT(jwt)
   if (!checkJWT) {
      res.status(400).json({ message: "Page does not exist anymore" })
      return
   }

   if (await service.existTokenInBLJWT(jwt)) {
      res.status(400).json({ message: "Token is used and expired" })
      return  
   }
   res.status(200).json(checkJWT)
})

// Request: token (header), newpassword: <new pass>
// Response: Fail | Success
app.options('/resetpassword/:token', cors())
app.post('/resetpassword/:token', cors(corsOptions), async (req, res) => {
   token  = req.params.token
   newpass = req.body.newpassword

   result = await service.updateUserPassword(token, newpass)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token"})
      return
   }

   result = await service.addTokenToBLJWT(token)
   if (!result) {
      res.status(400).json({ message: "Wrong/Expired token"})
      return
   }

   res.status(200).json({  message: "Update new password successfully" })
})

getAsync = require('util').promisify(server.listen).bind(server)
getAsync(port).then(async () => {
   console.log("App is listening on port 5000...")
   await service.connectRedis();
   await service.connectMongoDB();
}).then(() => {
   service.loadLBInRedis()
})



// ---------------------------------------------------------------------------
// -------------------------------WEB SOCKETIO--------------------------------
// ---------------------------------------------------------------------------



io.on('connection', function(socket) {
   // Set value for socket.room
   socket.room = ""

   // Broadcast info about ListGameRoom
   // Parameter: STRING token
   socket.on('client-request-info-listgameroom', async function(token) {
      result = await service.getInfoAllGameRoom(token)
      if (!result) return
      socket.emit('server-send-info-listgameroom', result)
   })

   // Broadcast info about Leaderboard
   // Parameter: STRING token
   socket.on('client-request-info-leaderboard', async function(token) {
      result = await service.getTop6LB(token)
      if (!result) return
      socket.emit('server-send-info-leaderboard', result)
   })
   
   // Set interval for broadcast info Leaderboard & ListGameRoom
   setInterval(async function() {
      // Leaderboard
      leaderboard = await service.getTop6LBNoToken()
      if (!leaderboard) leaderboard = [];
      socket.emit('server-send-info-leaderboard', leaderboard)

      // List Game Room
      listgameroom = await service.getInfoAllGameRoomNoToken()
      if (!listgameroom) listgameroom = [];
      socket.emit('server-send-info-listgameroom', listgameroom)
   }, 10000)

   // Chat in gameroom
   socket.on('client-request-chat-in-room', function(roomid, message) {
      socket.to(roomid).emit('server-send-chat-in-room', message)
   })

   /* 
      STATUS CODE
      ===========
      400: Wrong/Expired token
      401: Bet points isn't enough
      402: Wrong room password
      403: Room does not exist anymore

      500: Create room fail
      501: Update points fail
      502: Update guest status fail

      200: Success
   */

   // Create gameroom
   // Parameter: JSON gameroom (uuid, room_name, password, bet_points, host_id, host_displayed_name), STRING token
   socket.on('client-request-create-room', async function(gameroom, token) {
      hostInfo = await service.getUserInfo(token)
      if (hostInfo == false) {
         socket.emit('server-send-result-create-room', {statusCode: 400, message: "Wrong/Expired token"})
         return
      }

      if (hostInfo.points < gameroom.bet_points) {
         socket.emit('server-send-result-create-room', {statusCode: 401, message: "Bet points isn't enough"})
         return
      }

      oldPoints = hostInfo.points
      newPoints = hostInfo.points - gameroom.bet_points
      updatePoints = await service.updateUserPoints(token, newPoints)

      if (updatePoints == false) {
         socket.emit('server-send-result-create-room', {statusCode: 501, message: "Update points fail"})
         return
      }

      newRoom = await service.setGameRoom(token, gameroom)

      if (newRoom == false) {
         await service.updateUserPoints(token, oldPoints)
         socket.emit('server-send-result-create-room', {statusCode: 500, message: "Create room fail"})
         return
      }

      // Set socket session for disconnection
      socket.room = gameroom.uuid

      socket.join(gameroom.uuid) 
      socket.emit('server-send-result-create-room', {statusCode: 200, message: "Create room successfully"})
   })

   // Join gameroom
   // Parameter: JSON guest (guest_id, guest_displayed_name), JSON infogame (roomid, bet_points, password), STRING token
   socket.on('client-request-join-room', async function(guest, infogame, token) {
      guestInfo = await service.getUserInfo(token)
      
      if (guestInfo == false) {
         socket.emit('server-send-result-join-room', {statusCode: 400, message: "Wrong/Expired token"})
         return
      }
      
      if (guestInfo.points < infogame.bet_points) {
         socket.emit('server-send-result-join-room', {statusCode: 401, message: "Bet points isn't enough"})
         return
      }

      currentRoom = await service.getInfoOneGameRoomNoToken(infogame.roomid)

      if (!currentRoom){
         socket.emit('server-send-result-join-room', {statusCode: 403, message: "Room does not exist anymore"})
         return
      }

      if (infogame.password != currentRoom.password) {
         socket.emit('server-send-result-join-room', {statusCode: 402, message: "Wrong room password"})
         return
      }
      
      oldPoints = guestInfo.points
      newPoints = guestInfo.points - infogame.bet_points
      updatePoints = await service.updateUserPoints(token, newPoints)

      if (updatePoints == false) {
         socket.emit('server-send-result-join-room', {statusCode: 501, message: "Update points fail"})
         return
      }

      updateStatusGuest = await service.updateGuestAndStatusGR(token, infogame.roomid, guest)

      if (updateStatusGuest == false) {
         await service.updateUserPoints(token, oldPoints)
         socket.emit('server-send-result-join-room', {statusCode: 502, message: "Update guest status fail"})
         return
      }

      // Set socket session for disconnection
      socket.room = infogame.roomid

      hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)

      currentRoom = await service.getInfoOneGameRoomNoToken(infogame.roomid)
      currentRoom.guest_avatar = guestInfo.avatar
      currentRoom.host_avatar = hostInfo.avatar

      socket.join(infogame.roomid)
      io.in(infogame.roomid).emit('server-send-result-join-room', {statusCode: 200, message: "Join room successfully", data: currentRoom})
   })

   // Function process win/lose game
   // Parameter: roomid, isHost (host is winner or not), hasExit (has someone exists when the game does not end up or not)
   // If someone exists when the game does not end up => That player won't receive any points for lose/draw/win
   async function processWinloseGame(roomid, isHost, hasExit) {
      currentRoom = await service.getInfoOneGameRoomNoToken(roomid)

      hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)
      if (hostInfo == null) return
      guestInfo = await service.getUserInfoByIDNoToken(currentRoom.guest_id)
      if (guestInfo == null) return

      let statusGame, hostNewPoints, guestNewPoints

      if (isHost) {
         statusGame = 1

         hostNewPoints = (currentRoom.bet_points * 2 + hostInfo.points + 30)
         updateHostPoints = await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostNewPoints)

         if (hasExit == true) {
            guestNewPoints = guestInfo.points
         }
         else {
            guestNewPoints = (guestInfo.points + 10)
         }
         updateGuestPoints = await service.updateUserPointsByIDNoToken(currentRoom.guest_id, guestNewPoints)

         await service.updateUserWinNumByIDNoToken(currentRoom.host_id, hostInfo.win_num + 1)
         await service.updateUserLoseNumByIDNoToken(currentRoom.guest_id, guestInfo.lose_num + 1)
      }
      else {
         statusGame = -1

         if (hasExit == true) {
            hostNewPoints = hostInfo.points
         }
         else {
            hostNewPoints = (hostInfo.points + 10)
         }
         updateHostPoints = await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostNewPoints)

         guestNewPoints = (currentRoom.bet_points * 2 + guestInfo.points + 30)
         updateGuestPoints = await service.updateUserPointsByIDNoToken(currentRoom.guest_id, guestNewPoints)

         await service.updateUserWinNumByIDNoToken(currentRoom.guest_id, guestInfo.win_num + 1)
         await service.updateUserLoseNumByIDNoToken(currentRoom.host_id, hostInfo.lose_num + 1)
      }

      newGame = '{"id" : "' + currentRoom.uuid + '", "user_id" : "' + currentRoom.host_id + '", "guest_id" : "' + currentRoom.guest_id + '", "bet_points" : ' + currentRoom.bet_points + ', "status" : ' + statusGame + '}'
      addNewGame = await service.addGame(JSON.parse(newGame))

      await service.updatePointsLB(hostInfo.username, hostNewPoints)
      await service.updatePointsLB(guestInfo.username, guestNewPoints)
      await service.deleteGRNoToken(roomid)
   }

   // Function process draw game
   // Parameter: roomid
   async function processDrawGame(roomid) {
      currentRoom = await service.getInfoOneGameRoomNoToken(roomid)

      hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)
      guestInfo = await service.getUserInfoByIDNoToken(currentRoom.guest_id)

      hostNewPoints = (currentRoom.bet_points + hostInfo.points + 20)
      updateHostPoints = await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostNewPoints)
      guestNewPoints = (currentRoom.bet_points + guestInfo.points + 20)
      updateGuestPoints = await service.updateUserPointsByIDNoToken(currentRoom.guest_id, guestNewPoints)
      
      await service.updateUserDrawNumByIDNoToken(currentRoom.host_id, hostInfo.draw_num + 1)
      await service.updateUserDrawNumByIDNoToken(currentRoom.guest_id, guestInfo.draw_num + 1)

      newGame = '{"id" : "' + currentRoom.uuid + '", "user_id" : "' + currentRoom.host_id + '", "guest_id" : "' + currentRoom.guest_id + '", "bet_points" : ' + currentRoom.bet_points + ', "status" : 0}'
      addNewGame = await service.addGame(JSON.parse(newGame))
      
      await service.updatePointsLB(hostInfo.username, hostNewPoints)
      await service.updatePointsLB(guestInfo.username, guestNewPoints)
      await service.deleteGRNoToken(roomid)
   }
   
   // Mark pattern or win/draw
   // Parameter: JSON turn (x, y), gameStatus ("" | "win" | "draw"), infogame (roomid, isHost) => (host is winner or not)
   // Result: turn (x, y), data (statusCode, message("" | "lose" | "draw" | anything))
   socket.on('client-request-mark-pattern', async function(turn, gameStatus, infogame) {
      switch (gameStatus) {
         case "":
            data = {"statusCode": 200, "message": ""}
            socket.to(infogame.roomid).emit("server-send-data-game", turn, data)
            break;
         case "win":
            //false: noone exits when the game does not end up
            await processWinloseGame(infogame.roomid, infogame.isHost, false)
            data = {"statusCode": 200, "message": "lose"}
            socket.to(infogame.roomid).emit("server-send-data-game", turn, data)
            io.in(infogame.roomid).emit("server-ask-client-leave-room")
            break;
         case "draw":
            await processDrawGame(infogame.roomid)
            data = {"statusCode": 200, "message": "draw"}
            socket.to(infogame.roomid).emit("server-send-data-game", turn, data)
            io.in(infogame.roomid).emit("server-ask-client-leave-room")
            break;
      }
   })

   // Server receive error from client in game ("Draw" game will happen)
   // Parameter: STRING roomid
   // Result: data (statusCode, message
   socket.on('client-send-error-in-game', async function (roomid) {
      await processDrawGame(roomid)
      socket.emit("server-ask-client-leave-room")
   })

   // Client request out room when host is in room, no guest.
   // Parameter: roomid
   socket.on('host-out-room-not-started', async function(roomid) {
      // Give back to host bet_points
      currentRoom = await service.getInfoOneGameRoomNoToken(roomid)
      hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)
      await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostInfo.points + currentRoom.bet_points)

      // Delete room
      service.deleteGRNoToken(roomid)
      socket.emit("server-ask-client-leave-room")
   })

   // Client request out room => Determine win-lose for game
   // Parameter: roomid, isHost (host is winner or not)
   // Result: data (statusCode, message("win"))
   socket.on('client-request-out-room', async function(roomid, isHost) {
      //true: has someone exits when game does not end up
      await processWinloseGame(roomid, isHost, true) 
      data = {"statusCode": 200, "message": "win"}
      socket.to(roomid).emit("server-send-data-game", null, data)
      io.in(roomid).emit("server-ask-client-leave-room")
   })   

   // Someone disconnect, so the other becomes winner
   // Parameter: roomid, isHost (host is winner or not)
   socket.on('client-request-being-winner', async function(roomid, isHost) {
      currentRoom = await service.getInfoOneGameRoomNoToken(roomid)

      hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)
      guestInfo = await service.getUserInfoByIDNoToken(currentRoom.guest_id)

      let statusGame, hostNewPoints, guestNewPoints
      if (isHost) {
         statusGame = 1

         hostNewPoints = (currentRoom.bet_points * 2 + hostInfo.points + 30)
         updateHostPoints = await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostNewPoints)
         guestNewPoints = guestInfo.points
         updateGuestPoints = await service.updateUserPointsByIDNoToken(currentRoom.guest_id, guestNewPoints)

         await service.updateUserWinNumByIDNoToken(currentRoom.host_id, hostInfo.win_num + 1)
         await service.updateUserLoseNumByIDNoToken(currentRoom.guest_id, guestInfo.lose_num + 1)
      }
      else {
         statusGame = -1
         
         hostNewPoints = hostInfo.points
         updateHostPoints = await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostNewPoints)
         guestNewPoints = (currentRoom.bet_points * 2 + guestInfo.points + 30)
         updateGuestPoints = await service.updateUserPointsByIDNoToken(currentRoom.guest_id, guestNewPoints)

         await service.updateUserWinNumByIDNoToken(currentRoom.guest_id, guestInfo.win_num + 1)
         await service.updateUserLoseNumByIDNoToken(currentRoom.host_id, hostInfo.lose_num + 1)
      }

      newGame = '{"id" : "' + currentRoom.uuid + '", "user_id" : "' + currentRoom.host_id + '", "guest_id" : "' + currentRoom.guest_id + '", "bet_points" : ' + currentRoom.bet_points + ', "status" : ' + statusGame + '}'
      addNewGame = await service.addGame(JSON.parse(newGame))

      await service.updatePointsLB(hostInfo.username, hostNewPoints)
      await service.updatePointsLB(guestInfo.username, guestNewPoints)
      await service.deleteGRNoToken(roomid)

      leaveGR(roomid)
      socket.room = ""
   })

   // Disconnection
   socket.on('disconnect', async function() {
      if (socket.room != "") {
         roomid = socket.room
         // Only host in room
         if (await service.findGuestIDInRoomNoToken(roomid) == false) {
            // Give back to host bet_points
            currentRoom = await service.getInfoOneGameRoomNoToken(roomid)
            hostInfo = await service.getUserInfoByIDNoToken(currentRoom.host_id)
            await service.updateUserPointsByIDNoToken(currentRoom.host_id, hostInfo.points + currentRoom.bet_points)

            // Delete room
            await service.deleteGRNoToken(roomid)
         }
         // Host & guest are in room and playing game
         else {
            data = {"statusCode": 200, "message": "win"}
            socket.to(roomid).emit('room-has-player-out', data)
         }

         leaveGR(roomid)
         socket.room = ""
      }
   })
 
   // Function for leaving game room
   function leaveGR(roomid) {
      socket.leave(roomid)
   }

   // Socket for leaving game room
   // Used for ending game (have winner, loser or drawers) | receiving "server-ask-client-leave-room" | ...
   socket.on('client-request-leave-room', function(roomid) {
      socket.room = "" // Set socket session for disconnection
      leaveGR(roomid)
   })
});
 