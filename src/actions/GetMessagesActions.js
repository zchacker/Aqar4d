import {
  MESSAGES_LOADING_ATTEMPT,
  MESSAGES_LOADING_SUCCESS,
  MESSAGES_LOADING_FAILED
} from './types';

import {BASE_URL}  from '../screens/base_url';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export const getMessages = () => {
    return async (dispatch) => {
     dispatch({ type: MESSAGES_LOADING_ATTEMPT });

     let user_id   =  await AsyncStorage.getItem('user_id');


     let url = BASE_URL+"list_my_chat/"+user_id;


     axios.get(url)
      .then(resp => handleResponse(dispatch, resp.data))
      .catch(error => console.error( error));

   }
}


const handleResponse = (dispatch, data) => {
  if (!data.success) {
    //console.log('this is action faild result : ' , data)
    onGettingFailed(dispatch, data.success);
  }else {
     //console.log('this is action success result : ' , data)
     onGettingSuccess(dispatch, data )
  }
}

const onGettingSuccess = (dispatch, data) => {
  dispatch({ type: MESSAGES_LOADING_SUCCESS, data: data  })
};

const onGettingFailed = (dispatch, success) => {
  dispatch({ type: MESSAGES_LOADING_FAILED, error: success })
};
