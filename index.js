/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/screens/App';
import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import RoomNav from './src/tools/RootNav';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
