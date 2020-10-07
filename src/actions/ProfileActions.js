import {
  PROFILE_LOADING_ATTEMPT,
  PROFILE_LOADING_SUCCESS,
  PROFILE_LOADING_FAILED,
} from './types';

import {BASE_URL}  from '../screens/base_url';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';


export const load_entities = () => {
  //console.log(`email ${email} and password ${password}`)
  return async (dispatch) => {
     dispatch({ type: PROFILE_LOADING_ATTEMPT });

     let user_id   =  await AsyncStorage.getItem('user_id');

     let form_data = new FormData();
     form_data.append('user_id', user_id);

     //Call the back-end API
     //Please do not spam/abuse it so others can use it as well.
     let url = BASE_URL+'get_my_entities'
     console.log('user id ' , url);
     axios.post(url,form_data)
       .then(resp => handleResponse(dispatch, resp.data))
       .catch(error => console.error( error));
  };

}


const handleResponse = (dispatch, data) => {
  if (!data.success) {
    //console.log(data)
    onDataFetchFaild(dispatch, 'لا يمكن تحميل البيانات');
  }else {
     //console.log(data)
     onDataFetchSuccess(dispatch, data)
  }
}

const onDataFetchSuccess = (dispatch, data) => {
  dispatch({ type: PROFILE_LOADING_SUCCESS, entities: data  })
};

const onDataFetchFaild = (dispatch, errorMessage) => {
  dispatch({ type: PROFILE_LOADING_FAILED, error: errorMessage })
};
