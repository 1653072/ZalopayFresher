const redis = require("redis") 
let client = redis.createClient()
const { promisify } = require('util');
let repoRedis = {}

// Reference: https://github.com/NodeRedis/node_redis

// Connect to Redis
repoRedis.connectRedis = async () => {
    await client.on('connect', function() {
        console.log('Redis connected');
    });
}

// ------------------------------------------------
// BlackListJWT - Set => Shortname: BLJWT
// ------------------------------------------------
function keyBLJWT(jwt) {
    return ("BlackListJWT:" + jwt)
}

// Set JWT to Redis
// Parameter: SRING jwt, TIME (SECONDS) expires
// Result: True 
repoRedis.setBLJWT = async (jwt, expires) => {
    return (await client.setex(keyBLJWT(jwt), expires, 1))
}

// Check JWT existed in Redis or not
// Parameter: STRING jwt
// Result: True | False
repoRedis.isMemberBLJWT = (jwt) => {
    getAsync = promisify(client.get).bind(client)
    return getAsync(keyBLJWT(jwt)).then((res) => {
        return ((res==null) ? false : true)
    })
}

// ------------------------------------------------
// Leaderboard - Sorted Set => Shortname: LB
// ------------------------------------------------
const keyLB = "Leaderboard"

// Check REDIS Leaderboard is empty or not
// Result: True | False
repoRedis.isEmptyLeaderboard = () => {
    getAsync = promisify(client.keys).bind(client)
    return getAsync(keyLB).then((res) => {
        return ((res.length==0) ? true : false);
    })
}

// Add user to Leaderboard
// Parameter: STRING username, INT points
repoRedis.setFieldLB = (username, points) => {
    client.zadd(keyLB, points, username)
}

// Get top 6 of leaderboard
// Result: JSON array with top 6 users
repoRedis.getTop6LB = () => {
    getAsync = promisify(client.zrevrange).bind(client)
    return getAsync(keyLB, 0, 5, 'WITHSCORES').then((res) => {
        return res;
    })
}

// Get all top of leaderboard
// Result: JSON array with all top users
repoRedis.getAllTopLB = () => {
    getAsync = promisify(client.zrevrange).bind(client)
    return getAsync(keyLB, 0, -1, 'WITHSCORES').then((res) => {
        return res;
    })
}

// Get user ranking by username
// Parameter: STRING username
// Result: INT ranking+1 (ranking in redis starts with 0, we must plus 1)
repoRedis.getMyRanking = (username) => {
    getAsync = promisify(client.zrevrank).bind(client)
    return getAsync(keyLB, username).then((res) => {
        return (res+1);
    })
}

// ------------------------------------------------
// GameRoom:<uuid> Hash => Shortname: GR
// ------------------------------------------------
function keyGR(uuid) {
    return ("GameRoom:" + uuid)
}

// Add/Update info of gameroom to Redis
// Parameter: JSON gameroom (uuid, room_name, password, bet_points, host_id, host_displayed_name)
// is_waiting {0,1} => 1 means room is playing
repoRedis.setFieldGR = (gameroom) => {
    getAsync = promisify(client.hdel).bind(client)
    return getAsync(keyGR(gameroom.uuid), "guest_id", "guest_displayed_name").then((res) => {
        return client.hmset(keyGR(gameroom.uuid), ["uuid", gameroom.uuid, "room_name", gameroom.room_name, "password", gameroom.password, "bet_points", gameroom.bet_points, "host_id", gameroom.host_id, "host_displayed_name", gameroom.host_displayed_name, "is_waiting", 0])  
    })
}

// Update guestid & roomStatus
// Parameter: STRING uuid, JSON guest (guest_id, guest_displayed_name)
// is_waiting {0,1} => 1 means room is playing
repoRedis.updateGuestAndStatusGR = async (uuid, guest) => {
    getAsync = promisify(client.hsetnx).bind(client)
    return await getAsync(keyGR(uuid), "guest_id", guest.guest_id).then((res) => {
        if (!res) return false
        return getAsync(keyGR(uuid), "guest_displayed_name", guest.guest_displayed_name).then((res) => {
            if (!res) return false
            client.hmset(keyGR(uuid), ["is_waiting", 1])
            return true
        })
    })
}

// Get all info of one gameroom
// Parameter: STRING keyRoom
// Result: Info array
repoRedis.getInfoOfOneGR = async (uuid) => {
    getAsync = promisify(client.hgetall).bind(client)
    return await getAsync(keyGR(uuid)).then((res) => {
        if (res != null) res.bet_points = parseInt(res.bet_points, 10)
        return res
    })
}

// Get all keys of gamerooms
// Result: All gameroom keys
repoRedis.getAllKeysGR = async () => {
    getAsync = promisify(client.keys).bind(client)
    return await getAsync("GameRoom:*").then((res) => {
        if (res.length==0) return null
        return res
    })
}

// Get all info of all gamerooms
// Result: All info of all gamerooms
repoRedis.getInfoOfAllGR = async () => {
    allKeysGR = await repoRedis.getAllKeysGR()
    if (allKeysGR == null) return null

    var promises = []
    allKeysGR.forEach(element => {
        key = element.split(':', 2)
        uuid = key[1]
        promises.push(repoRedis.getInfoOfOneGR(uuid));
    })

    return Promise.all(promises)
    .then((res) => {
        return res
    })
}

// Delete room in Redis
// Parameter: uuid
// Result: True | False
repoRedis.deleteGR = async (uuid) => {
    getAsync = promisify(client.del).bind(client)
    return await getAsync(keyGR(uuid)).then((res) => {
        return res
    })
}

// Check current room has guest_id or not
repoRedis.findGuestIDInRoom = async (uuid) => {
    getAsync = promisify(client.hget).bind(client)
    return await getAsync(keyGR(uuid), "guest_id").then((res) => {
        if (res == null) return false
        return res
    })
}

module.exports = repoRedis;