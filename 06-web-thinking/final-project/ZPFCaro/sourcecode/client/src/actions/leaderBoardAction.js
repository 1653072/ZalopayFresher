import {store} from "../index";

import {getJwtFromStorage} from '../utils/storageUtil'

export const INIT_LEADERBOARD = "leaderBoard.INIT";
export const LOAD_LEADERBOARD = "leaderBoard.LOAD";

//type: response
export function initLeaderBoard() {
  return {
    type: INIT_LEADERBOARD
  };
}

function loadLeaderBoardAction(data){
  return{
    type: LOAD_LEADERBOARD,
    leaderBoard: data
  }
}

export function loadLeaderBoard() {
  return function(){
    let socket = store.getState().ioReducer.socket;
    socket.emit('client-request-info-leaderboard',getJwtFromStorage());
  }
}

export function listenOnLoadLeaderBoard(){
  return function(dispatch){
    let socket = store.getState().ioReducer.socket;
    socket.on('server-send-info-leaderboard', function(data){
      dispatch(loadLeaderBoardAction(data))
    })
  }
}