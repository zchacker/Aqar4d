import {
  ADDING_ENTITY,
  ADDING_SUCCESS,
  ADDING_FAILED
} from './types';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL}  from '../screens/base_url';

export const addEntity = ({title,adType,type,price,space,country,province,city,neighborhood,phone,email,description,location , video , images}) => {
  //console.log(`email ${email} and password ${password}`)

  return async (dispatch) => {

     dispatch({ type: ADDING_ENTITY });

     let user_id  = await AsyncStorage.getItem('user_id');

     let form_data = new FormData();

     form_data.append('add_by' , user_id);
     form_data.append('title', title);
     form_data.append('type', type);
     form_data.append('ad_type', adType);
     form_data.append('price', price);
     form_data.append('space', space);
     form_data.append('country', country);
     form_data.append('province', province);
     form_data.append('city', city);
     form_data.append('neighborhood', neighborhood);
     form_data.append('phone', phone);
     form_data.append('email', email);
     form_data.append('description', description);
     form_data.append('lat', location.latitude);
     form_data.append('lng', location.longitude);

     if(video != null){
       let videoToUpload = video;
       form_data.append('video', {type: videoToUpload.mime , uri:videoToUpload.path , name:videoToUpload.path } );
     }

     // add images
     images.map( (value , key) => {
       //console.log('iamge value ' + value.mime + ' key : ' + key );
       let imageToUpload = images[key];
       form_data.append('images[]', {type: imageToUpload.mime , uri:imageToUpload.path , name:imageToUpload.path } );
     });

     console.log('this is action method' , form_data);

     let url = BASE_URL + "add_entity";
     console.log('add entity url ',url)
     //Call the back-end API
     //Please do not spam/abuse it so others can use it as well.
    axios.post(url,form_data)
      .then(resp => handleResponse(dispatch, resp.data))
      .catch(error => console.error( error));

  };

}


const handleResponse = (dispatch, data) => {
  if (!data.success) {
    console.log('this is fild data : ' , data)
    onAddingFailed(dispatch, data);
  }else {
     console.log('this is action result : ' , data)
     onAddingSuccess(dispatch, data.success )
  }
}

const onAddingSuccess = (dispatch, success) => {
  dispatch({ type: ADDING_SUCCESS, error:success  })
};

const onAddingFailed = (dispatch, success) => {
  dispatch({ type: ADDING_FAILED, error:success })
};
