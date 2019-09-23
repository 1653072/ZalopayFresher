let repoMongo = require('../repository/repoMongo');
let repoRedis = require('../repository/repoRedis');
let bcrypt = require('bcrypt')
const tokenKey = "TKEteJHPgZldsuYkvYm0SREY-ZPFCaro"
let jwt = require('jsonwebtoken');
let service = {}

/* --------------------------------------------------------------
                            FUNCTIONS
   -------------------------------------------------------------- */

// Generate JWT (Auto expires after 7 days)
// Parameter: JSON data
// Result: Token
service.generateJWT = async (data) => {
    return (await jwt.sign(data, tokenKey, {expiresIn: "7d"}))
}

// Generate JWT (with expires after x minutes)
// Parameter: JSON data, minutes
// Result: Token
service.generateJWTExpMinutes = async (data, minutes) => {
    exp = minutes + 'm'
    return (await jwt.sign(data, tokenKey, {expiresIn: exp}))
}

// Verify JWT
// Parameter: STRING token
// Result: JSON username | Error about token (wrong characters/expired)
service.verifyJWT = async (token) => {
    if (!token) return false;
    if (token.length == 0) return false

    if (await service.existTokenInBLJWT(token)) return false

    let val = jwt.verify(token, tokenKey, function(err, decoded) {
        if (err) {
            console.log(err)
            return false
        } 
        return JSON.parse('{"username" : "' + decoded.username + '"}')
    });
    return val
}

// Get remaining expired time of JWT 
// Parameter: STRING token
// Result: SECOND time | Null
service.getRemainExpTimeOfJWT = (token) => {
    let val = jwt.verify(token, tokenKey, function(err, decoded) {
        if (err) {
            console.log(err)
            return null
        } 
        curTime = Math.floor(new Date().getTime()/1000)
        return (decoded.exp - curTime)
    });
    return val
}

// Compare hashPassword & rawPassword
// Parameter: STRING rawPass, hashPass
// Result: True | False
service.comparePassword = async (rawPass, hashPass) => {
    return (await bcrypt.compare(rawPass, hashPass))
}

// Bcrypt for password
// Parameter: STRING raw password
// Result: Hashed password
service.hashPassword = async (rawPass) => {
    return (await bcrypt.hash(rawPass, 12))
}

// Send email "forgotpassword" to user
// Parameter: STRING email, username, url
// Result: True | False
service.sendEmail = (email, username, url) => {
    let nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'zpfcaro@gmail.com',
          pass: 'zpfcaro2019'
        }
    });
      
    let mailOptions = {
        from: 'zpfcaro@gmail.com',
        to: email,
        subject: '[ZPFCaro] Request Change Password',
        html: "<html>\
                    <div>\
                        <div>Dear " + username + ",<br><br></div>\
                        \
                        <div>You have asked to reset your password for ZPF Caro. Please click the link below to change your password.<br><br></div>\
                        \
                        <div><a href=\"" + url + "\">Click to change password</a><br><br></div>\
                        \
                        <div>This link will work for 30 minutes after this email was sent.<br><br></div>\
                        \
                        <div>If you didn't ask for a new password, please ignore this email. Don't worry: your account is still secure, and no one else can access it. You can continue to log in with your existing password.<br><br></div>\
                        \
                        <div>Best wishes,<br><br></div>\
                        \
                        <div>Customer Support</div>\
                        <div>ZPF Caro</div>\
                        <div>*** This is an automatically generated email, please do not reply ***</div>\
                    </div>\
                </html>"
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err)
    });
}

/* --------------------------------------------------------------
                    REPOSITORY OF MONGODB 
   -------------------------------------------------------------- */

// Connect to repository of MongoDB
service.connectMongoDB = async () => {
    await repoMongo.connectMongoDB()
}

// Check info of login
// Parameter: STRING username, password
// Result: Token (login succesfully) | False (Wrong username, password, error)
service.checkLogin = async (username, password) => {
    userInfo = await repoMongo.getUserByUsername(username)
    if (userInfo == null) return false

    valComparePass = await service.comparePassword(password, userInfo.password)
    if (!valComparePass) return false

    jsonUsername = JSON.parse('{"username" : "' + username + '"}')
    token = await service.generateJWT(jsonUsername)
    
    return token
}

// Get user info (by username)
// Parameter: STRING token
// Result: False | User info
service.getUserInfo = async (token) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.getUserByUsername(username))
}

// Get user info (by id & no token)
// Parameter: STRING id
// Result: False | User info
service.getUserInfoByIDNoToken = async (id) => {
    return (await repoMongo.getUserById(id))
}

// Get user info (by email & no token)
// Parameter: STRING email
// Result: False | User info
service.getUserInfoByEmailNoToken = async (email) => {
    return (await repoMongo.getUserByEmail(email))
}

// Update losenum
// Parameter: STRING token, INT losenum
// Result: True | False
service.updateUserLoseNum = async (token, losenum) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updateLoseNumOfUser(username, losenum))
}

// Update losenum by ID (no token)
// Parameter: INT losenum
// Result: True | False
service.updateUserLoseNumByIDNoToken = async (id, losenum) => {
    return (await repoMongo.updateLoseNumOfUserByID(id, losenum))
}

// Update drawnum
// Parameter: STRING token, INT drawnum
// Result: True | False
service.updateUserDrawNum = async (token, drawnum) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updateDrawNumOfUser(username, drawnum))
}

// Update drawnum by ID (no token)
// Parameter: INT drawnum
// Result: True | False
service.updateUserDrawNumByIDNoToken = async (id, drawnum) => {
    return (await repoMongo.updateDrawNumOfUserByID(id, drawnum))
}

// Update winnum
// Parameter: STRING token, INT winnum
// Result: True | False
service.updateUserWinNum = async (token, winnum) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updateWinNumOfUser(username, winnum))
}

// Update winnum by id (no token)
// Parameter: INT winnum
// Result: True | False
service.updateUserWinNumByIDNoToken = async (id, winnum) => {
    return (await repoMongo.updateWinNumOfUserByID(id, winnum))
}

// Update points
// Parameter: STRING token, INT points
// Result: True | False
service.updateUserPoints = async (token, points) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updatePointsOfUser(username, points))
}

// Update points by ID (no token)
// Parameter: STRING id, INT points
// Result: True | False
service.updateUserPointsByIDNoToken = async (id, points) => {
    return (await repoMongo.updatePointsOfUserByID(id, points))
}

// Update avatar
// Parameter: STRING token, STRING avatar
// Result: True | False
service.updateUserAvatar = async (token, avatar) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updateAvatarOfUser(username, avatar))
}

// Update password
// Parameter: STRING token, STRING password
// Result: True | False
service.updateUserPassword = async (token, password) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    hashPass = await service.hashPassword(password)
    return (await repoMongo.updatePasswordOfUser(username, hashPass))
}

// Check email is unique or not
// Parameter: STRING email
// Result True | False
service.isUniqueEmail = async (email) => {
    result = await repoMongo.getUserByEmail(email)
    if (result == null) return true
    return false
}

// Update email
// Parameter: STRING token, STRING email
// Result: True | False
service.updateUserEmail = async (token, email) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username

    isUniqueEmail = await service.isUniqueEmail(email)
    if (!isUniqueEmail) return false

    return (await repoMongo.updateEmailOfUser(username, email))
}

// Update name
// Parameter: STRING token, STRING name
// Result: True | False
service.updateUserDisplayedName = async (token, name) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username
    return (await repoMongo.updateNameOfUser(username, name))
}

// Check username is unique or not
// Parameter: STRING username
// Result: True | False
service.isUniqueUsername = async (username) => {
    result = await repoMongo.getUserByUsername(username)
    return ((result==null) ? true : false )
}

// Randomize avatar [1, 12]
service.randomAvatar = () => {
    // After randomizing, we will receive value in [0, 11] => We have to plus 1
    val = Math.floor(Math.random() * Math.floor(12)) + 1
    return ('/static/' + val + '.png')
}

// Add new user to MongoDB
// Parameter: STRING username, password, email, displayedname, avatar
// Result: User | Null
service.addNewUser = async (username, password, email, displayedname, avatar) => {
    hashpass = await service.hashPassword(password)
    newUser = '{"username" : "' + username + '", "password" : "' + hashpass + '", "email" : "' + email + '", "display_name" : "' + displayedname + '", "avatar" : "' + avatar + '"}'
    newUser = JSON.parse(newUser);
    return (await repoMongo.addUser(newUser))
}

// Add game to MongoDB after having result
// Function receives JSON "newGame" parameters with string structure:
// '{"id" : "xxxxx", "user_id" : "xxxxx", "guest_id" : "xxxxx", "bet_points" : xxxxx, "status" : xxxxx}'
// status has one of three values : -1 (host lost), 0 (both of persions drew), 1 (host won)
service.addGame = async (newGame) => {
    result = await repoMongo.addGame(newGame)
    return ((result == null) ? false : true)
}   

/* --------------------------------------------------------------
                        REPOSITORY OF REDIS 
   -------------------------------------------------------------- */

// Connect to repository of MongoDB
service.connectRedis = () => {
    repoRedis.connectRedis()
}

// Verify that logout token exists in Redis or not
// Parameter: STRING token
// Result: True | False
service.existTokenInBLJWT = async (token) => {
    return (await repoRedis.isMemberBLJWT(token))
}

// Add token to BLJWT when user LOGOUT
// Parameter: STRING token
// Result: True | False
service.addTokenToBLJWT = async (token) => {
    if (await service.existTokenInBLJWT(token)) return false

    expires = await service.getRemainExpTimeOfJWT(token)
    if (expires == null) return false

    return (await repoRedis.setBLJWT(token, expires))
}

// Check REDIS Leaderboard is empty or not
// Result: True | False
service.isEmptyLB = async () => {
    return (await repoRedis.isEmptyLeaderboard())
}

// Load all ranking (leaderboard) from MongoDB to Redis when Leaderboard in Redis is empty
service.loadLBInRedis = async () => {
    if (!await service.isEmptyLB()) return
    arrayUser = await repoMongo.getAllUsers()
    arrayUser.forEach(async element => {
        await service.updatePointsLB(element.username, element.points)
    });
}

// Add/Update points into leaderboard
// Parameter: STRING username, INT points
service.updatePointsLB = (username, points) => {
    repoRedis.setFieldLB(username, points)
}

// Process top user info (add more 2 field info: display_name & points)
async function JsonTopUserInfoLB(array) {
    let arrTop6 = []
    for (let i=0; i<array.length-1; i+=2) {
        userInfoDB = await repoMongo.getUserByUsername(array[i])
        if (userInfoDB == null) continue
        var user = '{"username" : "'+ array[i] + '", "display_name" : "' + userInfoDB.display_name + '", "points" : ' + array[i+1] + '}'
        arrTop6.push(JSON.parse(user))
    }

    return arrTop6
}

// Get leaderboard (top 6)
// Parameter: STRING token
// Result: False | Leaderboard
service.getTop6LB = async (token) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    return JsonTopUserInfoLB(await repoRedis.getTop6LB())
}

// Get leaderboard (top 6) (no token)
// Result: Leaderboard
service.getTop6LBNoToken = async () => {
    return JsonTopUserInfoLB(await repoRedis.getTop6LB())
}

// Get leaderboard (all top)
// Parameter: STRING token
// Result: False | Leaderboard
service.getAllTopLB = async (token) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    return JsonTopUserInfoLB(await repoRedis.getAllTopLB())
}

// Get leaderboard (all top) (no token)
// Result: Leaderboard
service.getAllTopLBNoToken = async () => {
    return JsonTopUserInfoLB(await repoRedis.getAllTopLB())
}

// Get my ranking
// Parameter: STRING token
// Result: JSON username & ranking
service.getMyRanking = async (token) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    username = verifyToken.username

    myRank = await repoRedis.getMyRanking(username)
    result = '{"username" : "'+ username + '", "ranking" : ' + myRank + '}'

    return JSON.parse(result);
}

// Get info of all gamerooms
// Parameter: STRING token
// Result: False | Null | List gameroom
service.getInfoAllGameRoom = async (token) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    
    let allGameRooms = []
    allGameRooms = await repoRedis.getInfoOfAllGR()
    if (allGameRooms == null) return null

    return allGameRooms
}

// Get info of all gamerooms (no token)
// Result: Null | List gameroom
service.getInfoAllGameRoomNoToken = async () => {
    let allGameRooms = []
    allGameRooms = await repoRedis.getInfoOfAllGR()
    if (allGameRooms == null) return null

    return allGameRooms
}

// Get info of one gameroom
// Parameter: STRING token, uuid
// Result: False | Gameroom info
service.getInfoOneGameRoom = async (token, uuid) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false

    val = await repoRedis.getInfoOfOneGR(uuid)
    return ((val==null) ? false : val)
}

// Get info of one gameroom (no token)
// Parameter: STRING uuid
// Result: False | Gameroom info
service.getInfoOneGameRoomNoToken = async (uuid) => {
    val = await repoRedis.getInfoOfOneGR(uuid)
    return ((val==null) ? false : val)
}

// Add/Update gameroom info
// Parameter: JSON gameroom (uuid, room_name, password, bet_points, host_id) | Token
// is_waiting {0,1} => 1 means room is playing
// Result: False | True
service.setGameRoom = async (token, gameroom) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false
    return (await repoRedis.setFieldGR(gameroom))
}

// Update guest_id & status of gameroom
// Parameter: STRING uuid, token, JSON guest (guest_id, guest_displayed_name)
// Result: False | True
service.updateGuestAndStatusGR = async (token, uuid, guest) => {
    verifyToken = await service.verifyJWT(token)
    if (!verifyToken) return false

    return (await repoRedis.updateGuestAndStatusGR(uuid, guest))
}

// Delete game room (no token)
service.deleteGRNoToken = async (uuid) => {
    return (await repoRedis.deleteGR(uuid))
}

// Check current room has guest_id or not (no token)
service.findGuestIDInRoomNoToken = async (uuid) => { 
    return (await repoRedis.findGuestIDInRoom(uuid))
}

module.exports = service;