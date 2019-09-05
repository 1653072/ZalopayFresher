import { store } from "../index";
import { calculateResult, createNewRandomMove } from "../utils/gameUtil";
import { logout,loadUserInfo } from "./userAction";
import { initMessages } from "./chatAction";

export const PLACE_PATTERN = "game.PLACE_PATTERN";
export const COUNTDOWN_TICK = "game.COUNTDOWN_TICK";
export const COUNTDOWN_START = "game.COUNTDOWN_RESTART";
export const CREATE_RANDOM_MOVE = "game.CREATE_RANDOM_MOVE";
export const COUNTDOWN_CLEAR = "game.COUNTDOWN_CLEAR";
export const COUNTDOWN_RESET = "game.COUNTDOWN_RESET ";
export const LOAD_GAME = "game.LOAD_GAME";
export const WAITTING = "game.WAITTING";
export const JOIN_GAME = "game.JOIN_GAME";
export const START_GAME = "game.START_GAME";
export const UPDATE_GAME = "game.UPDATE_GAME";
export const END_GAME = "game.END_GAME";
export const WANT_TO_QUIT_GAME = "game.QUIT_GAME";
export const LEAVE_GAME = "game.LEAVE_GAME";
export const HOST_OUT_ROOM_NOT_START = 1;
export const HOST_LOGOUT_ROOM_NOT_START = 4;
export const OUT_ROOM_BY_EXIT = 2;
export const OUT_ROOM_BY_LOGOUT = 3;

export function placeMyPattern(x, y) {
  let socket = store.getState().ioReducer.socket;
  let gameState = store.getState().gameReducer;
  let turn = { x: x, y: y };
  let gameStatus = calculateResult(
    gameState.gameBoard,
    x,
    y,
    gameState.gamePattern,
    gameState.emptyCellNum
  );
  let infoGame = {
    roomid: gameState.roomId,
    isHost: !gameState.opponent.isHost
  };
  socket.emit("client-request-mark-pattern", turn, gameStatus, infoGame);
  return function(dispatch) {
    dispatch(placePattern(x, y, gameStatus, gameState.gamePattern, false));
    if (gameStatus != "") {
      dispatch(endGame(gameStatus));
    }
  };
}

export function listenOpponentTurn() {
  let gameState = store.getState().gameReducer;
  return function(dispatch) {
    let socket = store.getState().ioReducer.socket;
    socket.on("server-send-data-game", function(turn, data) {
      if (data.statusCode === 200) {
        if (turn)
          dispatch(
            placePattern(
              turn.x,
              turn.y,
              data.mesage,
              gameState.gamePattern === "x" ? "o" : "x",
              true
            )
          );
        if (data.message != "") {
          dispatch(endGame(data.message));
        }
      }
    });
  };
}

export function createRandomMove() {
  let gameState = store.getState().gameReducer;
  var randomMove = createNewRandomMove(
    gameState.width,
    gameState.height,
    gameState.gameBoard
  );
  return function(dispatch) {
    dispatch(placeMyPattern(randomMove.x, randomMove.y));
  };
}

export function placePattern(x, y, result, gamePattern, isOppturn) {
  return {
    type: PLACE_PATTERN,
    x: x,
    y: y,
    result: result,
    gamePattern: gamePattern,
    isMyTurn: isOppturn
  };
}

export function loadGame(game) {
  return {
    type: LOAD_GAME,
    game: game,
    isMyTurn: false
  };
}

export function updateGame(game) {
  return {
    type: UPDATE_GAME,
    game: game,
    isMyTurn: true
  };
}

export function waittingGame(history) {
  return function(dispatch) {
    let socket = store.getState().ioReducer.socket;
    if (!socket) {
      history.push("/");
      return;
    }
    socket.on("server-send-result-join-room", function(res) {
      if (res.statusCode == 200) {
        dispatch(updateGame(res.data));
      } else {
        history.push("/");
      }
    });
  };
}

export function joinGame(currentGame) {
  return {
    type: JOIN_GAME,
    game: currentGame,
    isMyTurn: false
  };
}

export function endGame(result) {
  return {
    type: END_GAME,
    result: result
  };
}

export function leaveGame(history, quitType) {
  return function(dispatch) {
    let gameState = store.getState().gameReducer;
    let socket = store.getState().ioReducer.socket;
    if (quitType == OUT_ROOM_BY_LOGOUT) {
      let isHostWin = gameState.opponent.isHost;
      socket.emit("client-request-out-room", gameState.roomId, isHostWin);
      dispatch({ type: LEAVE_GAME });
      dispatch(logout(history));
    } else if (quitType == HOST_OUT_ROOM_NOT_START) {
      socket.emit("host-out-room-not-started", gameState.roomId);
      // dispatch(loadUserInfo(history));
      dispatch({ type: LEAVE_GAME });
      history.push("/");
    } else if (quitType == HOST_LOGOUT_ROOM_NOT_START) {
      socket.emit("host-out-room-not-started", gameState.roomId);
      dispatch({ type: LEAVE_GAME });
      dispatch(logout(history));
    } else  if (quitType == OUT_ROOM_BY_EXIT) {
      let isHostWin = gameState.opponent.isHost;
      socket.emit("client-request-out-room", gameState.roomId, isHostWin);
    dispatch({ type: LEAVE_GAME });
      history.push("/");
    }
    else{
      dispatch({ type: LEAVE_GAME });
      history.push("/");
    }
    dispatch(initMessages());
    return {
      type: LEAVE_GAME
    };
  };
}

export function wantToQuitGame(isCloseModal, isLogOut = false) {
  if (isCloseModal) {
    return {
      type: WANT_TO_QUIT_GAME,
      alert: ""
    };
  }
  let gameState = store.getState().gameReducer;
  if (!gameState.opponent || gameState.opponent.userId == "") {
    return {
      type: WANT_TO_QUIT_GAME,
      alert: "Are you sure to quit the game?",
      quitType: isLogOut ? HOST_LOGOUT_ROOM_NOT_START : HOST_OUT_ROOM_NOT_START
    };
  } else {
    return {
      type: WANT_TO_QUIT_GAME,
      alert: "Are you sure you want to leave?\n You will lose this match!",
      quitType: isLogOut ? OUT_ROOM_BY_LOGOUT : OUT_ROOM_BY_EXIT
    };
  }
}

export function countDownTick() {
  return {
    type: COUNTDOWN_TICK
  };
}

export function countDownStart(intervalId) {
  return {
    type: COUNTDOWN_START,
    intervalId: intervalId
  };
}

export function countDownClear() {
  return {
    type: COUNTDOWN_CLEAR
  };
}

export function listenOnServerAskLeave() {
  return function () {
    let socket = store.getState().ioReducer.socket;
    if (socket){
      socket.on("server-ask-client-leave-room", function () {
        let gameState = store.getState().gameReducer;
        socket.emit("client-request-leave-room", gameState.roomId);
      });
    }

  };
}

export function listenOnOpponentLeaveGame() {
  return function(dispatch) {
    let socket = store.getState().ioReducer.socket;
    socket.on("room-has-player-out", function(res) {
      if (res.statusCode == 200) {
        let gameState = store.getState().gameReducer;
        let isHostWin = !gameState.opponent.isHost;
        socket.emit("client-request-being-winner", gameState.roomId, isHostWin);
        dispatch(endGame(res.message));
      }
    });
  };
}
