import {
  MESSAGES_LOADING_ATTEMPT,
  MESSAGES_LOADING_SUCCESS,
  MESSAGES_LOADING_FAILED
} from '../actions/types';

const INIT_STATE  = { data:[] , loading: false , error: '' }

const GetMessagesReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  MESSAGES_LOADING_ATTEMPT:
      return {...INIT_STATE , loading: true  }
    case  MESSAGES_LOADING_FAILED:
      return {...INIT_STATE  , loading: false , error: action.error }
    case MESSAGES_LOADING_SUCCESS:
      return {...INIT_STATE , loading: false, data: action.data  }
    default:
      return state;
  }
}


export default GetMessagesReducer
