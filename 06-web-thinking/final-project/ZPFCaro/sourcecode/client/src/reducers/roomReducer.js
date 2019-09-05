import {
  INIT_GAMEROOM,
  LOAD_GAMEROOMS,
  ERR_CREATE_ROOM,
  ERR_JOIN_ROOM
} from "../actions/roomAction";

import { initState, convertResponseToState } from "../utils/roomUtil";

const initialState = initState();

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_GAMEROOM:
      return state;
    case LOAD_GAMEROOMS:
      // merge old state and new rooms
      return {
        // ...state,
        ...convertResponseToState(action.rooms, action.userId)
      };
    case ERR_CREATE_ROOM:
      return {
        ...state,
        error: action.message
      };
    case ERR_JOIN_ROOM:
      return {
        ...state,
        error: action.message
      };
    default:
      return state;
  }
};

export default roomReducer;
