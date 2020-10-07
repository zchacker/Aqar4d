import {
  PROFILE_LOADING_ATTEMPT,
  PROFILE_LOADING_SUCCESS,
  PROFILE_LOADING_FAILED,

  PROFILE_EDIT_LOADING_ATTEMPT,
  PROFILE_EDIT_LOADING_SUCCESS,
  PROFILE_EDIT_LOADING_FAILED,
} from '../actions/types';

const INIT_STATE  = { userData:null , loading: false , error: '' , btn_loading: false }

const EditProfileReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  PROFILE_LOADING_ATTEMPT:
      return {...state , loading: true }
    case  PROFILE_LOADING_FAILED:
      return {...INIT_STATE  , loading: false , error: action.error }
    case PROFILE_LOADING_SUCCESS:
      return {...INIT_STATE , loading: false, userData: action.userData  }
      
    case  PROFILE_EDIT_LOADING_ATTEMPT:
      return {...state , btn_loading: true}
    case  PROFILE_EDIT_LOADING_SUCCESS:
      return {...INIT_STATE , btn_loading: false, userData: action.userData  }
    case PROFILE_EDIT_LOADING_FAILED:
      return {...INIT_STATE  , btn_loading: false , error: action.error }
    default:
      return state;
  }
}



export default EditProfileReducer
