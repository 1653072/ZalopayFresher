
import { INIT_LEADERBOARD, LOAD_LEADERBOARD } from "../actions/leaderBoardAction";

import { initState } from "../utils/leaderBoardUtil";
import {coverResponseToSate} from "../utils/leaderBoardUtil"

const initialState = initState();
const MAX_RANK_IN_LEADERBOARD = 6;

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
      case INIT_LEADERBOARD:
        return state;
      case LOAD_LEADERBOARD:
        return {
            ...coverResponseToSate(action.leaderBoard,MAX_RANK_IN_LEADERBOARD)
        }
      default:
        return state;
    }
  };
  
  export default roomReducer;
  
   