/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React , {Component} from 'react';
import {
  StatusBar,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import Login from './Login';
import AsyncStorage from '@react-native-community/async-storage';

export default class Splash extends  React.Component{

  componentDidMount(){
       // Start counting when the page is loaded
       this.timeoutHandle = setTimeout(()=>{
            AsyncStorage.getItem('logged_in')
              .then(token => {
                  if (token){
                    this.props.navigation.replace('MainTab');
                  }else{
                    this.props.navigation.replace('Login');
                  }
              });

       }, 3000);
  }

  componentWillUnmount(){
       clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }

  render(){
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#f6eb14" barStyle="dark-content" />
        <Image
          style={styles.logo}
          source={require('../../imgs/icon.png')}
        />
      </View>
    )
  }
}

// ffff00
const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f6eb14',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{

  },
  logo:{
    width:240,
    height:240,
  }
})
