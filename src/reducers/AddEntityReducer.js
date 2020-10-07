import {
  ADDING_ENTITY,
  ADDING_SUCCESS,
  ADDING_FAILED
} from '../actions/types';

const INIT_STATE = { data:[] , loading: false , error: false}
const AddEntityReducer = (state = INIT_STATE , action) =>{
  switch(action.type){
    case  ADDING_ENTITY:
      return {...state , loading: true}
    case  ADDING_FAILED:
      return {...INIT_STATE , loading: false , error: action.error }
    case ADDING_SUCCESS:
          return {...INIT_STATE, loading: false, error: action.error  }
    default:
      return state;
  }
}

export default AddEntityReducer
