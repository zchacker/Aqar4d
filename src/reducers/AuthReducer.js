import {
  LOGIN_ATTEMPT,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} from '../actions/types';

const INIT_STATE = { user:null , loading: false , error: ''}
const AuthReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  LOGIN_ATTEMPT:
      return {...state , loading: true}
    case  LOGIN_FAILED:
      return {...INIT_STATE , loading: false , error: action.error }
    case LOGIN_SUCCESS:
          return {...INIT_STATE, loading: false, user: action.user  }
    default:
      return state;
  }
}

export default AuthReducer
