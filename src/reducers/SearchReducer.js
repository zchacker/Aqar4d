import {
  ENTITIES_LOADING_ATTEMPT ,
  ENTITIES_LOADING_SUCCESS ,
  ENTITIES_LOADING_FAILED ,
} from '../actions/types';

const INIT_STATE  = { entities:[] , loading: false , refreshing: false ,  error: '' }

const SearchReducer = (state = INIT_STATE , action) =>{

  switch(action.type){
    case  ENTITIES_LOADING_ATTEMPT:
      return {...INIT_STATE , loading: true  }
    case  ENTITIES_LOADING_FAILED:
      return {...INIT_STATE  , loading: false , error: action.error }
    case ENTITIES_LOADING_SUCCESS:
      return {...INIT_STATE , loading: false, entities: action.data  }
    default:
      return state;
  }

}




export default SearchReducer
