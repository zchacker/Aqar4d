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

const SearchButton = (props) => (
  <View style={styles.buttonWrap}>
    <TouchableOpacity
      style={styles.offButton}
      onPress={() => { props.nav.navigate('Search')  } }
      >
      <View>
        <Icon name={'search'} size={28} color={'#000000'}   />
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
    width:60,
    marginRight: 0,
  },
  offButton:{
    margin:5,
    marginRight:5,
    marginLeft:5,
  },
});

export default connect(null)(withNavigation(SearchButton));
