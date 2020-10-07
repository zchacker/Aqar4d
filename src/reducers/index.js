import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import EditProfileReducer from './EditProfileReducer';
import GetDataProfileReducer from './EditProfileReducer';
import ProfileReducer from './ProfileReducer';
import HomeReducer from './HomeReducer';
import AddEntityReducer from './AddEntityReducer';
import GetMessagesReducer from './GetMessagesReducer';
import SearchReducer from './SearchReducer';

export default combineReducers ({
  auth : AuthReducer,
  editProfile: EditProfileReducer,
  profileData: EditProfileReducer,
  profileReducer: ProfileReducer,
  homeReducer: HomeReducer,
  addEntityReducer: AddEntityReducer,
  getMessagesReducer: GetMessagesReducer,
  searchReducer: SearchReducer,
});
