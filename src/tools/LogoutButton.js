// LogoutButton

import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Alert
} from 'react-native';
import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

const logout = (props) => {
    AsyncStorage.removeItem('app_token');
    AsyncStorage.removeItem('user_id');
    AsyncStorage.removeItem('logged_in');
    props.nav.navigate('Login');
}

const showAlert = (props) => {
  // Works on both iOS and Android
  Alert.alert(
    'تنبيه!',
    'هل تريد فعلا تسجيل الخروج؟',
    [
      {
        text: 'إلغاء',
        onPress: () => console.log('Cancel Pressed' , props),
        style: 'cancel',
      },
      {text: 'موافق', onPress: () => logout(props) },
    ],
    {cancelable: false},
  );
}

const LogoutButton = (props) => (
  <View style={styles.buttonWrap}>
    <TouchableOpacity
      style={styles.offButton}
      onPress={() => { props.nav.navigate('Settings')  } }
      >
      <View>
        <Icon name={'cog'} size={28} color={'#000000'}   />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.offButton}
      onPress={() => { showAlert(props)  } }
      >
      <View>
        <Icon name={'power-off'} size={28} color={'#000000'}   />
      </View>
    </TouchableOpacity>

  </View>
)


const styles = StyleSheet.create({
  buttonWrap:{
    flexDirection:'row',
    justifyContent:'space-between',
    // justifyContent: 'center',
    flex:1,
    width:100,
    marginRight: 10,
  },
  offButton:{
    margin:5,
    marginRight:20,
    marginLeft:10,
  },
});

export default connect(null)(withNavigation(LogoutButton));
