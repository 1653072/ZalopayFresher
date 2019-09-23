import {store} from "../index";

export const ADD_MESSAGE = "chat.ADD_MESSAGE";
export const INIT_MESSAGES = "chat.INIT_MESSAGES";

//type: response
export function addMessage(message, avatar, displayedName, type) {
  return {
    type: ADD_MESSAGE,
    message: message,
    avatar: avatar,
    displayedName: displayedName,
    types: type
  };
}

export function initMessages() {
  return {
    type: INIT_MESSAGES
  };
}


export function addMyMessage(message) {
  let socket = store.getState().ioReducer.socket;    
  let gameState =  store.getState().gameReducer; 
  let userState =  store.getState().userReducer; 
  socket.emit('client-request-chat-in-room',gameState.roomId,message);
  return function(dispatch){
    dispatch(addMessage(message,userState.avatar,userState.displayedName,'response'))
  }
}


export function listenOpponentChat(){
  let opponentState =  store.getState().gameReducer.opponent; 
  return function(dispatch){
    let socket = store.getState().ioReducer.socket;    
    socket.on('server-send-chat-in-room',function(message){
      dispatch(addMessage(message,opponentState.avatar,opponentState.displayedName,'recieve'))
    })
  }
}