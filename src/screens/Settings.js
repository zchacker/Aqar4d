// Settings

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React , {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView ,
  KeyboardAvoidingView,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Alert,
  FlatList
} from 'react-native';

import {BASE_URL , UPLOAD_URL}  from './base_url';
import { loginUser , load_entities} from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , SettingsButton } from '../components';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-community/async-storage';

const DATA = [
  {
    rout: 'edit_my_profile',
    title: 'تعديل بياناتي',
  },
  {
    rout: 'edit_password',
    title: 'تغيير كلمة المرور',
  },
];

class Settings extends Component{

  itemRender = (item) => {
    console.log(' settigns ' , item.item.title )

    return(
      <TouchableOpacity key={item.index} onPress={() => this.props.navigation.push(item.item.rout) } >
        <View style={styles.listItem}>
          <Text  style={styles.listItemText} >{item.item.title}</Text>
        </View>
      </TouchableOpacity >
    )
  }

  _view_render(){

    return(
      <View style={styles.container}>

        <FlatList
          style={styles.container2}
          data={DATA}
          renderItem={this.itemRender}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
    )

  }

  render(){
    return(
      this._view_render()
    )
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  listItem:{
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    height:50,
    borderBottomColor:'#C8C8C7',
    borderBottomWidth:1,
    padding:5,
    paddingLeft:10,
    paddingRight:10,
    marginTop:10,
  },
  listItemText:{
    fontSize:20,
    fontWeight:'bold',
  },
  userImage:{
    width:45,
    height:45,
    marginRight:20,
    marginLeft:20,
    // flex:0.3,
  },
});

const mapStateToProps = state => {
  return {
    error: state.profileReducer.error,
    loading: state.profileReducer.loading,
    userData: state.profileReducer.userData,
    entities: state.profileReducer.entities,
  }
}

export default connect(mapStateToProps , { loginUser , load_entities })(Settings);
