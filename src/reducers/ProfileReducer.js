import {
  PROFILE_LOADING_ATTEMPT,
  PROFILE_LOADING_SUCCESS,
  PROFILE_LOADING_FAILED,

} from '../actions/types';

const INIT_STATE  = { userData:null , entities:null , loading: false , error: '' }


const ProfileReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  PROFILE_LOADING_ATTEMPT:
      return {...state , loading: true }
    case  PROFILE_LOADING_FAILED:
      return {...INIT_STATE  , loading: false , error: action.error }
    case PROFILE_LOADING_SUCCESS:
          return {...INIT_STATE , loading: false, entities: action.entities  }
    default:
      return state;
  }
}



export default ProfileReducer
