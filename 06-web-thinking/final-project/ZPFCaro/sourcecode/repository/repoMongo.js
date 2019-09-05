const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const { promisify } = require('util');
ObjectID = require('mongodb').ObjectID
let repoMongo = {}
let collectionUsers 
let collectionGames

// Connect to MongoDB & get database with name "ZPFCaro"
repoMongo.connectMongoDB = async () => {
    await mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        let myDB = client.db('ZPFCaro')
        collectionUsers = myDB.collection('Users')
        collectionGames = myDB.collection('Games')
        console.log("MongoDB connected")
    })
    .catch((err) => {
        console.log(err)
    })
}

// Get all users
repoMongo.getAllUsers = async () => {
    let val = await collectionUsers.find().toArray()
    return (val != null) ? val : null
}

// Get user by username
repoMongo.getUserByUsername = async (username) => {
    let val = await collectionUsers.findOne({username: username})
    return (val != null) ? val : null
}

// Get user by email
repoMongo.getUserByEmail = async (email) => {
    let val = await collectionUsers.findOne({email: email}) 
    return (val != null) ? val : null
}

// Get user by id
repoMongo.getUserById = async (id) => {
    let val = await collectionUsers.findOne({_id: new ObjectID(id)})
    return (val != null) ? val : null
}

// Add user 
// Function receives JSON "newUser" parameters with string structure:
// '{"username" : "xxxxx", "password" : "xxxxx", "email" : "xxxxx", "display_name" : "xxxxx", "avatar" : "xxxxx"}'
repoMongo.addUser = (newUser) => {
    getAsync = promisify(collectionUsers.insertOne).bind(collectionUsers)
    return getAsync({username: newUser.username, password: newUser.password, email: newUser.email, display_name: newUser.display_name, points: 0, avatar: newUser.avatar, win_num: 0, draw_num: 0, lose_num: 0}).then((res) => {
        return res
    }).catch((err) => {
        console.log(err)
        return null
    })
}

// Update display_name of user by username
repoMongo.updateNameOfUser = (username, newName) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)

    return getAsync({username: username}, {$set: {display_name: newName}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update email of user by username
repoMongo.updateEmailOfUser = (username, newemail) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {email: newemail}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update password of user by username
repoMongo.updatePasswordOfUser = (username, newpassword) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {password: newpassword}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update avatar link of user by username
repoMongo.updateAvatarOfUser = (username, avatarlink) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {avatar: avatarlink}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update points of user by username
repoMongo.updatePointsOfUser = (username, points) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {points: points}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update points of user by id
repoMongo.updatePointsOfUserByID = (id, points) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({_id: new ObjectID(id)}, {$set: {points: points}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update win_num of user by username
repoMongo.updateWinNumOfUser = (username, win_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {win_num: win_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update win_num of user by id
repoMongo.updateWinNumOfUserByID = (id, win_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({_id: new ObjectID(id)}, {$set: {win_num: win_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update draw_num of user by username
repoMongo.updateDrawNumOfUser = (username, draw_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {draw_num: draw_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update draw_num of user by id
repoMongo.updateDrawNumOfUserByID = (id, draw_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({_id: new ObjectID(id)}, {$set: {draw_num: draw_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update lose_num of user by username
repoMongo.updateLoseNumOfUser = (username, lose_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {lose_num: lose_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update lose_num of user by id
repoMongo.updateLoseNumOfUserByID = (id, lose_num) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({_id: new ObjectID(id)}, {$set: {lose_num: lose_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// Update user info (update all user info excepts username)
// Parameter: A JSON variable contains all user info | Structure of JSON:
// '{"password" : "xxxxx", "email" : "xxxxx", "display_name" : "xxxxx", "avatar" : "xxxxx", "points" : xxxxx, "win_num" : xxxxx, "draw_num" : xxxxx, "lose_num" : xxxxx}'
repoMongo.updateUserInfo = (username, userInfo) => {
    getAsync = promisify(collectionUsers.updateOne).bind(collectionUsers)
    return getAsync({username: username}, {$set: {password: userInfo.password, email: userInfo.email, display_name: userInfo.display_name, avatar: userInfo.avatar, points: userInfo.points, win_num: userInfo.win_num, draw_num: userInfo.draw_num, lose_num: userInfo.lose_num}}).then((res) => {
        return true
    }).catch((err) => {
        console.log(err)
        return false
    })
}

// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------

// Add game
// Function receives JSON "newGame" parameters with string structure:
// '{"id" : "xxxxx", "user_id" : "xxxxx", "guest_id" : "xxxxx", "bet_points" : xxxxx, "status" : xxxxx}'
// status has one of three values : -1 (host lost), 0 (both of persions drew), 1 (host won)
repoMongo.addGame = (newGame) => {
    getAsync = promisify(collectionGames.insertOne).bind(collectionGames)
    return getAsync({_id: newGame.id, user_id: newGame.user_id, guest_id: newGame.guest_id, bet_points: newGame.bet_points, status: newGame.status}).then((res) => {
        return res
    }).catch((err) => {
        console.log(err)
        return null
    })
}

// Get info game by gameID
repoMongo.getGameByID = async (gameID) => {
    let val = await collectionGames.findOne({_id: gameID}) 
    return (val != null) ? val : null
}

module.exports = repoMongo;