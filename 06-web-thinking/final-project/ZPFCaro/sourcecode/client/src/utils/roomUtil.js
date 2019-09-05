
export function initState() {
    let initStateValue = {
      gameRooms:{},
      error:''
    };
    return initStateValue;
  }
  

export function creaRoomReq(hostId, hostDisplayedName, roomName, passWord, betPoints){
    const uuidv1 = require('uuid/v1');
    return{
      gameroom:{
        'uuid':uuidv1(),
        'room_name': roomName,
        'password':passWord?passWord:'',
        'bet_points':betPoints?betPoints:0,
        'host_id':hostId,
        'host_displayed_name':hostDisplayedName
      },
      error:''
    }
}

export function joinGameGuestReq(id,name){
  return {
    guest_id:id,
    guest_displayed_name:name
  }
}

export function joinGameInfoRoomReq(id,points,password){
  return {
    roomid:id,
    bet_points:points,
    password:password
  }
}
export function convertResponseToState(rooms,userId){
  let res = [];
  if (rooms && rooms.length > 0)
  rooms.forEach(room => {
    if (room && room['is_waiting'] == 0 && room['host_id']!=userId){
      let id = room.uuid.split('-');
      res[room.uuid] =  {
        id: 'R-'+id[3],
        'fullId':room.uuid,
        roomName:room['room_name'],
        hasPassword:room['password'],
        betPoints:room['bet_points'],
        hostDisplayedName:room['host_displayed_name'],
        isPlaying:room['is_waiting']
      }
    }
  });
  return {gameRooms:res};
}