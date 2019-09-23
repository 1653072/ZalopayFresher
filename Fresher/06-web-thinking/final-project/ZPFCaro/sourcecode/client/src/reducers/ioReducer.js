import {INIT_IO} from '../actions/ioAction'
import io from 'socket.io-client';

const ioReducer = (state = {}, action) => {
    switch (action.type) {
      case INIT_IO:
        return {
            socket : io("http://localhost:3000")
        }
    default:
      return state;
    }
  };
  
  export default ioReducer;
  
   