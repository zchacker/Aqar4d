import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  TouchableNativeFeedback,
  View
} from 'react-native';

import { createAppContainer , withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

import LogoutButton from './LogoutButton';
import SearchButton from './SearchButton';
import SearchBar from './SearchBar';

import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Details_page from '../screens/Details_page';
import Profile_page from '../screens/Profile_page';
import Edit_my_profile from '../screens/Edit_my_profile';
import Messages_page from '../screens/Messages_page';
import Message_conversation from '../screens/Message_conversation';
import Add_entity from '../screens/Add_entity';
import Edit_enetity from '../screens/Edit_enetity';
import Edit_password from '../screens/Edit_password';
import Settings from '../screens/Settings';
import Search from '../screens/Search';

const logout = (navigation , props) => {

    // AsyncStorage.removeItem('app_token');
    // AsyncStorage.removeItem('user_id');
    // AsyncStorage.removeItem('logged_in');
    //navigation.navigate('Login');

    //navigation.navigate('Login');

    console.log( 'props : ' , props)

}

const homeTabStack = createStackNavigator({
    Home: {
      screen: Home,
      navigationOptions:({ navigation, screenProps }) => ({
        title: "الرئيسية",
        headerRight: <SearchButton nav={navigation}/>,
      })
    },
    Details_page: {
      screen: Details_page,
      navigationOptions:({ navigation, screenProps }) => ({
        title: "تفاصيل العقار",
      })
    },
    Edit_enetity:{
      screen: Edit_enetity,
      navigationOptions:({ navigation, screenProps }) => ({
        title: "تعديل العقار",
      })
    },
    Search:{
      screen: Search,
      navigationOptions:({ navigation, screenProps }) => ({
        
        headerRight: <SearchBar nav={navigation}/>,
      })
    },
  },
  {
  initialRouteName: "Home"
  }
);

const addTabStack = createStackNavigator({
    Add_entity: {
      screen: Add_entity,
      navigationOptions:({ navigation, screenProps }) => ({
        title: "إضافة عقار",
      })
    },
    Profile_page: {
      screen: Profile_page,
      navigationOptions:({ navigation, screenProps }) => ({
        title: "الصفحة الشخصية",
      })
    }
  },
  {
    initialRouteName: "Add_entity"
  }
);

const messagesTabStack = createStackNavigator({
  Messages_page:{
    screen:Messages_page,
    navigationOptions:({navigation , screenProps}) => ({
      title:'الرسائل',
    })
  },
  Message_conversation:{
    screen:Message_conversation,
    navigationOptions:({navigation , screenProps}) => ({
      title:'محادثة',
    })
  }
},
{
    initialRouteName: "Messages_page"
}
);

messagesTabStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const RootNav2 = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions:{
        header: null,
    }
  },
})

const profileTabStack = createStackNavigator({
  Profile_page:{
    screen:Profile_page,
    navigationOptions:({navigation , screenProps}) => ({
      title:'صفحتك الشخصية',
      headerRight: <LogoutButton nav={navigation}/>,
    })
  },
  Edit_enetity:{
    screen:Edit_enetity,
    navigationOptions:({navigation , screenProps}) => ({
      title:'تعديل العقار'
    })
  },
  edit_my_profile:{
    screen:Edit_my_profile,
    navigationOptions:({navigation , screenProps}) => ({
      title:'تعديل بياناتي'
    })
  },
  Details_page: {
    screen: Details_page,
    navigationOptions:({ navigation, screenProps }) => ({
      title: "تفاصيل العقار",
    })
  },
  edit_password: {
    screen: Edit_password,
    navigationOptions:({ navigation, screenProps }) => ({
      title: "تغيير كلمة المرور",
    })
  },
  Settings:{
    screen: Settings,
    navigationOptions:({ navigation, screenProps }) => ({
      title: "الإعدادات",
    })
  }

},
{
  initialRouteName: "Profile_page"
}
);



const mainTab = createBottomTabNavigator({
 Home:{
   screen:homeTabStack,
   navigationOptions:{
     tabBarLabel:'الرئيسية',
   }
 },
 Add:{
   screen:addTabStack,
   navigationOptions:{
     tabBarLabel:'اضف',
   }
 },
 Messages:{
   screen:messagesTabStack,
   navigationOptions:{
     tabBarLabel:'الرسائل',
   }
 },
 Profile:{
   screen:profileTabStack,
   navigationOptions:{
     tabBarLabel:'حسابي'
   }
 }
 },
 {
   /* Other configuration remains unchanged */
   defaultNavigationOptions: ({ navigation }) => ({
   tabBarIcon: ({ focused, horizontal, tintColor }) => {
     const { routeName } = navigation.state;
     let IconComponent = Icon;
     //Ionicons;
     let iconName;
     if (routeName === 'Home') {
       //iconName = `ios-information-circle${focused ? '' : '-outline'}`;
       iconName = 'home';
       // Sometimes we want to add badges to some icons.
       // You can check the implementation below.
       //IconComponent = HomeIconWithBadge;
     }else if (routeName === 'Add') {
       iconName = 'plus-square';
     }else if(routeName === 'Messages'){
       iconName = 'envelope';
     }else if(routeName === 'Profile'){
       iconName = 'user';
     }

     // You can return any component that you like here!
     return <IconComponent name={iconName} size={25} color={tintColor} />;
   },
 }),
   tabBarOptions: {
     activeTintColor: '#D3AD10',
     inactiveTintColor: '#C9C9C8',
   },

 }
);

const RootNav = createStackNavigator({
    MainTab:{
      screen:mainTab,
      navigationOptions: {
          header: null,
      }
    },
    Splash: {
      screen: Splash,
      navigationOptions: {
          header: null,
      }
    },
    Login: {
      screen: Login,
      navigationOptions:{
          header: null,
          gesturesEnabled: false,
      }
    },
    Register:{
      screen: Register,
      navigationOptions: {
          header: null,
      }
    },
    Home:{
      screen: Home,
      navigationOptions:{
          header: null,
      }
    }
  },
  {
    initialRouteName: "Splash"
  }
);


const styles = StyleSheet.create({

});

export default createAppContainer(RootNav);
