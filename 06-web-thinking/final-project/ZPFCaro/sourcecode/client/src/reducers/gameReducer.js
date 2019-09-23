import {
  PLACE_PATTERN,
  COUNTDOWN_TICK,
  COUNTDOWN_START,
  COUNTDOWN_CLEAR,
  COUNTDOWN_RESET,
  LOAD_GAME,
  JOIN_GAME,
  UPDATE_GAME,
  END_GAME,
  WANT_TO_QUIT_GAME,
  LEAVE_GAME
} from "../actions/gameAction";
import { initState } from "../utils/gameUtil";

const CELL_WIDTH = 32;
const CELL_HEIGHT = 22;
const COUNTDOWN_MAX = 15;
const initialState = initState(CELL_WIDTH, CELL_HEIGHT, COUNTDOWN_MAX);

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLACE_PATTERN:
      return {
        ...state,
        emptyCellNum: state.emptyCellNum - 1,
        gameBoard: [
          ...state.gameBoard,
          (state.gameBoard[action.y][action.x].pattern = action.gamePattern)
        ],
        countDown: {
          ...state.countDown,
          value: COUNTDOWN_MAX
        },
        result: action.result,
        isMyTurn: action.isMyTurn
      };
    case COUNTDOWN_TICK:
      return {
        ...state,
        countDown: {
          ...state.countDown,
          value: state.countDown.value - 1
        }
      };
    case COUNTDOWN_START:
      return {
        ...state,
        countDown: {
          ...state.countDown,
          value: COUNTDOWN_MAX,
          intervalId: action.intervalId
        }
      };
    case LOAD_GAME: // host load when enter game
      return {
        ...initState(CELL_WIDTH, CELL_HEIGHT, COUNTDOWN_MAX),
        roomId: action.game.uuid,
        roomName: action.game["room_name"],
        betPoints: action.game["bet_points"] + " pts",
        gamePattern: "x",
        result: "",
        isWaiting: true,
        isMyTurn: action.isMyTurn
      };
    case UPDATE_GAME: // host update game when guest join
      return {
        ...initState(CELL_WIDTH, CELL_HEIGHT, COUNTDOWN_MAX),
        roomId: action.game.uuid,
        roomName: action.game["room_name"],
        betPoints: action.game["bet_points"] + " pts",
        gamePattern: "x",
        opponent: {
          ...state,
          userId: action.game["guest_id"],
          displayedName: action.game["guest_displayed_name"],
          isHost: false,
          avatar: action.game["guest_avatar"]
        },
        result: "",
        isWaiting: false,
        isMyTurn: action.isMyTurn
      };
    case JOIN_GAME: // guest update when join game
      return {
        ...initState(CELL_WIDTH, CELL_HEIGHT, COUNTDOWN_MAX),
        roomId: action.game.uuid,
        roomName: action.game["room_name"],
        betPoints: action.game["bet_points"] + " pts",
        gamePattern: "o",
        result: "",
        opponent: {
          ...initialState.opponent,
          userId: action.game["host_id"],
          displayedName: action.game["host_displayed_name"],
          avatar: action.game["host_avatar"],
          isHost: true
        },
        isWaiting: false,
        isMyTurn: action.isMyTurn
      };
    case WANT_TO_QUIT_GAME:
      return{
        ...state,
        alert:action.alert,
        quitType:action.quitType
      }
    case LEAVE_GAME:
        clearInterval(state.countDown.intervalId);
        return{
        ...initState(CELL_WIDTH, CELL_HEIGHT, COUNTDOWN_MAX),
      }
    case END_GAME:
      clearInterval(state.countDown.intervalId);
      return {
        ...state,
        result: action.result,
        countDown: {
          ...state.countDown,
          intervalId: -1
      },
        isMyTurn: false
      };

    case COUNTDOWN_CLEAR:
      clearInterval(state.countDown.intervalId);
      return {
        ...state,
        countDown: {
          ...state.countDown,
          intervalId: -1
        }
      };
    case COUNTDOWN_RESET: {
      return {
        ...state,
        countDown: {
          ...state.countDown,
          value: COUNTDOWN_MAX
        }
      };
    }
    default:
      return state;
  }
};

export default gameReducer;
