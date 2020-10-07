import {
  HOME_LOADING_ATTEMPT ,
  HOME_LOADING_SUCCESS ,
  HOME_LOADING_FAILED ,
} from '../actions/types';

const INIT_STATE  = { data:[] , loading: false , refreshing: false ,  error: '' }

const HomeReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  HOME_LOADING_ATTEMPT:
      return {...INIT_STATE , loading: true  }
    case  HOME_LOADING_FAILED:
      return {...INIT_STATE  , loading: false , error: action.error }
    case HOME_LOADING_SUCCESS:
      return {...INIT_STATE , loading: false, data: action.data  }
    default:
      return state;
  }
}


export default HomeReducer
