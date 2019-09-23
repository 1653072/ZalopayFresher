import {store} from "../index";
import {joinGameGuestReq, creaRoomReq, joinGameInfoRoomReq} from "../utils/roomUtil";
import {getJwtFromStorage,clearStorage} from '../utils/storageUtil'
import {loadGame,joinGame} from './gameAction'
export const INIT_GAMEROOM = "room.INIT_GAMEROOM";
export const LOAD_GAMEROOMS = "room.LOAD_GAMEROOMS";
export const CREATE_GAMEROOM = "room.CREATE_GAMEROOM";
export const ERR_CREATE_ROOM = "room.ERR_CREATE_ROOM";
export const ERR_JOIN_ROOM = "room.ERR_CREATE_ROOM";

//type: response
export function initGameRoom() {
  return {
    type: INIT_GAMEROOM
  };
}

export function createGameRoom(hostId,displayedName, roomName,password,betPoints,history) {
  let request = creaRoomReq(hostId,displayedName,roomName,password,betPoints);
  return function(dispatch) {
    let socket = store.getState().ioReducer.socket;
    socket.emit('client-request-create-room',request.gameroom,getJwtFromStorage())
    socket.on('server-send-result-create-room', function(res){
      if (res.statusCode == 200){
        dispatch(loadGame(request.gameroom));
        history.push('/game');
      }
      else if (res.statusCode == 501 || res.statusCode == 502){
        dispatch(createError('Sorry :( Something went wrong!'));
        history.push('/');
      }
      else if (res.statusCode == 400){ //jwt fail
        clearStorage();
        history.push('/login');
      }
      else{
        dispatch(createError(res.message));
        history.push('/');
      }
    })

  };
}

export function createError(message){
  return{
    type:ERR_CREATE_ROOM,
    message: message
  }
}

export function joinError(message){
  return{
    type:ERR_JOIN_ROOM,
    message: message
  }
}

export function joinGameRoom(userId, displayedName, roomId, betPoints, password,history) {
  let guest = joinGameGuestReq(userId,displayedName);
  let infogame = joinGameInfoRoomReq(roomId, betPoints, password);

  return function(dispatch) {
    let socket = store.getState().ioReducer.socket;
    socket.emit('client-request-join-room',guest,infogame,getJwtFromStorage())
    socket.on('server-send-result-join-room', function(res){
      if (res.statusCode == 200){
        dispatch(joinGame(res.data));
        history.push('/game');
      }
      else if (res.statusCode == 501 || res.statusCode == 502){
        dispatch(createError("Room's Full"));
        history.push('/');
      }
      else if (res.statusCode == 400){ //jwt fail
        clearStorage();
        history.push('/login');
      }
      else{
        dispatch(createError(res.message));
        history.push('/');
      }
    })

  };
}

function loadGameRoomAction(data){
  if (store.getState().gameReducer.roomId == ""){
    let userId = store.getState().userReducer.id;
    return{
      type: LOAD_GAMEROOMS,
      rooms: data,
      userId: userId
    }
  }
  else return{type: LOAD_GAMEROOMS}
}

export function loadGameRooms() {
  return function(dispatch){
    let socket = store.getState().ioReducer.socket;
    socket.emit('client-request-info-listgameroom',getJwtFromStorage());
  } 
}

export function listenOnLoadGameRooms(){
  return function(dispatch){
    let socket = store.getState().ioReducer.socket;
    socket.on('server-send-info-listgameroom', function(data){
      dispatch(loadGameRoomAction(data))
    })
  }
}