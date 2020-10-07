import {
  HOME_LOADING_ATTEMPT ,
  HOME_LOADING_SUCCESS ,
  HOME_LOADING_FAILED ,
} from './types';

import {BASE_URL}  from '../screens/base_url';
import axios from 'axios';


export const homeData = () => {
  //console.log(`email ${email} and password ${password}`)
  return async (dispatch) => {
    dispatch({ type: HOME_LOADING_ATTEMPT });
    let form_data = new FormData();

    //Call the back-end API
    //Please do not spam/abuse it so others can use it as well.
    let url = BASE_URL + 'get_all_entites/1'
    axios.get(url)
      .then(resp => handleResponse(dispatch, resp.data))
      .catch(error => console.error( error));

  };
}

const handleResponse = (dispatch, data) => {
  if (!data.success) {
    onDataFetchFaild(dispatch, 'لا يمكن تحميل البيانات');
  }else {
     onDataFetchSuccess(dispatch, data)
  }
}


const onDataFetchSuccess = (dispatch, data) => {
  dispatch({ type: HOME_LOADING_SUCCESS, data: data  })
};

const onDataFetchFaild = (dispatch, errorMessage) => {
  dispatch({ type: HOME_LOADING_FAILED, error: errorMessage })
};
