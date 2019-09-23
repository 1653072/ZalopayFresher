import { ADD_MESSAGE, INIT_MESSAGES } from "../actions/chatAction";

import { initState } from "../utils/chatUtils";

const initialState = initState();

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            message: action.message,
            avatar: action.avatar,
            displayedName: action.displayedName,
            type: action.types
          }
        ]
      };
    case INIT_MESSAGES:
      return {...initState()};

    default:
      return state;
  }
};

export default chatReducer;
