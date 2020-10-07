import {
  ENTITIES_LOADING_ATTEMPT,
  ENTITIES_LOADING_SUCCESS,
  ENTITIES_LOADING_FAILED,
} from './types';

import {BASE_URL}  from '../screens/base_url';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const search_entities = (keyword) => {

  //console.log(`email ${email} and password ${password}`)
  return async (dispatch) => {
     dispatch({ type: ENTITIES_LOADING_ATTEMPT });

     let user_id   =  await AsyncStorage.getItem('user_id');

     let form_data = new FormData();
     form_data.append('keyword', keyword);

     //Call the back-end API
     //Please do not spam/abuse it so others can use it as well.
     let url = BASE_URL+'search/1'
     console.log('user id ' , url);

     axios.post(url,form_data)
       .then(resp => handleResponse(dispatch, resp.data))
       .catch(error => console.error( error));
  };

}


const handleResponse = (dispatch, data) => {
  if (!data.success) {
    console.log(data)
    onDataFetchFaild(dispatch, 'لا يمكن تحميل البيانات');
  }else {
     console.log(data)
     onDataFetchSuccess(dispatch, data)
  }
}

const onDataFetchSuccess = (dispatch, data) => {
  console.log('to reducer ...' , data)
  dispatch({ type: ENTITIES_LOADING_SUCCESS , data: data  })
};

const onDataFetchFaild = (dispatch, errorMessage) => {
  dispatch({ type: ENTITIES_LOADING_FAILED, error: errorMessage })
};
