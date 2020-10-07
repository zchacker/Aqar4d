import {
  PROFILE_LOADING_ATTEMPT,
  PROFILE_LOADING_SUCCESS,
  PROFILE_LOADING_FAILED,

  PROFILE_EDIT_LOADING_ATTEMPT,
  PROFILE_EDIT_LOADING_SUCCESS,
  PROFILE_EDIT_LOADING_FAILED,
} from './types';

import {BASE_URL}  from '../screens/base_url';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const editProfile = ({name , phone , email}) => {

  return async (dispatch) => {
      dispatch({ type: PROFILE_EDIT_LOADING_ATTEMPT });

      let user_id  = await AsyncStorage.getItem('user_id');

      let form_data = new FormData();
      form_data.append('user_id', user_id);
      form_data.append('name', name);
      form_data.append('phone', phone);
      form_data.append('email', email);

       //Call the back-end API
      //Please do not spam/abuse it so others can use it as well.
      let url = BASE_URL+'edit_my_info';

      axios.post( url , form_data )
        .then(resp => handleResponse2(dispatch, resp.data))
        .catch(error => console.error( error));
  };

}

export const profileData = () => {
  //console.log(`email ${email} and password ${password}`)
  return async (dispatch) => {
     dispatch({ type: PROFILE_LOADING_ATTEMPT });

     let app_token =  await AsyncStorage.getItem('app_token');
     let user_id   =  await AsyncStorage.getItem('user_id');

     //console.log(app_token)
    // console.log(user_id)

      let form_data = new FormData();
      form_data.append('token', app_token);
      form_data.append('user_id', user_id);

       //Call the back-end API
      //Please do not spam/abuse it so others can use it as well.
      let url = BASE_URL + 'get_my_data/'
      axios.post(url,form_data)
        .then(resp => handleResponse(dispatch, resp.data))
        .catch(error => console.error( error));
  };

}

export const edit_password = ({old_pass , new_pass}) => {
  return async (dispatch) => {
     dispatch({ type: PROFILE_EDIT_LOADING_ATTEMPT });
     let user_id  = await AsyncStorage.getItem('user_id');

     let form_data = new FormData();
     form_data.append('user_id', user_id);
     form_data.append('old_pass', old_pass);
     form_data.append('new_pass', new_pass);

     let url = BASE_URL+'edit_password';

     axios.post( url , form_data )
       .then(resp => handleResponse2(dispatch, resp.data))
       .catch(error => console.error( error));

  }
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

const handleResponse2 = (dispatch, data) => {
  if (!data.success) {
    console.log('action data : ' , data)
    onDataEditFaild(dispatch, data.success);
  }else {
     //console.log(data)
     onDataEditSuccess(dispatch, data)
  }
}

const onDataEditSuccess = (dispatch, userData) => {
  dispatch({ type: PROFILE_EDIT_LOADING_SUCCESS, userData: userData  })
};

const onDataEditFaild = (dispatch, errorMessage) => {
  dispatch({ type: PROFILE_EDIT_LOADING_FAILED, error: errorMessage })
};

const onDataFetchSuccess = (dispatch, userData) => {
  dispatch({ type: PROFILE_LOADING_SUCCESS, userData: userData  })
};

const onDataFetchFaild = (dispatch, errorMessage) => {
  dispatch({ type: PROFILE_LOADING_FAILED, error: errorMessage })
};
