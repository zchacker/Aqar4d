import {
  LOGIN_ATTEMPT,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} from './types';

import {BASE_URL}  from '../screens/base_url';
//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const loginUser = ({email,password}) => {
  //console.log(`email ${email} and password ${password}`)

  return (dispatch) => {
     dispatch({ type: LOGIN_ATTEMPT });

      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

       //Call the back-end API
      //Please do not spam/abuse it so others can use it as well.
      let url = BASE_URL+'login/';

      axios.post( url , params )
        .then(resp => handleResponse(dispatch, resp.data))
        .catch(error => console.error( error));
  };

}

export const registerUser = ({name, type, email , phone , password}) => {

    return (dispatch) => {
       dispatch({ type: LOGIN_ATTEMPT });

       const params = new URLSearchParams();
       params.append('name', name);
       params.append('type', type);
       params.append('email', email);
       params.append('phone', phone);
       params.append('password', password);

        //Call the back-end API
       //Please do not spam/abuse it so others can use it as well.
       let url = BASE_URL+'register/';

       axios.post( url , params )
         .then(resp => registerHandleResponse(dispatch, resp.data))
         .catch(error => console.error( error));

    }

}

const registerHandleResponse = (dispatch , data) => {
  if (!data.success) {
    console.log('onRegisterFailed : ' , data);
    onRegisterFailed(dispatch, data.server_msg);
  }else {
     console.log('onRegisterSuccess : ' , data);
     onRegisterSuccess(dispatch, data )
  }
}

const onRegisterSuccess = (dispatch, user ) => {
  dispatch({ type: LOGIN_SUCCESS, user:user  })
};

const onRegisterFailed = (dispatch, errorMessage) => {
  dispatch({ type: LOGIN_FAILED, error: errorMessage })
};

const handleResponse = (dispatch, data) => {
  if (!data.success) {
    // console.log(data)
    onLoginFailed(dispatch, data.server_msg);
  }else {
     console.log(data)
     onLoginSuccess(dispatch, data.user, data.token)
  }
}


const onLoginSuccess = (dispatch, user, token) => {

  AsyncStorage.setItem('logged_in', 'yes')
  AsyncStorage.setItem('user_id',user.user_id)
  AsyncStorage.setItem('app_token',token)
    .then(() => {
      dispatch({ type: LOGIN_SUCCESS, user:user  })
  });

};

const onLoginFailed = (dispatch, server_msg) => {
  dispatch({ type: LOGIN_FAILED, error: server_msg })
};
