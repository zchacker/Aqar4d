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
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';

import {BASE_URL}  from './base_url';
import { loginUser , getMessages } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , SmallSpinner } from '../components';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-community/async-storage';

class Messages_page extends Component{

  constructor(){
    super();
    this.state = {
      chats: [],
      refreshing:false,
    }
  }

  componentDidMount(){
    //console.log('want to load')
    AsyncStorage.getItem('logged_in')
    .then(token => {
        if (token != 'yes'){
          this.props.navigation.navigate('Register');
        }else{
            this.props.getMessages();
        }
    });

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('We recived props ' , nextProps)
    if(nextProps.loading == false){

      if(nextProps.data.success){
        //console.log('We recived props ' , nextProps)
        this.setState({
          chats: nextProps.data.chat_list,
          refreshing:false,
        })
      }else{
        this.setState({ refreshing: false })
      }

    }
  }

  refresh_messages = () => {
    this.setState({ refreshing: true })
    this.props.getMessages()
  }

  _goToConversion = (to_user_id , other_participate_name) => {
    this.props.navigation.navigate('Message_conversation' , { user_id: to_user_id , username: other_participate_name });
  }

  itemRender = (item) => {
    var other_participate_name = 'المستخدم محذوف';
    if(item.item.other_participate_name != null)
      var other_participate_name = item.item.other_participate_name;

    return(
      <TouchableOpacity key={item.index} onPress={() => this._goToConversion(item.item.other_participate_id , other_participate_name)} >
        <View style={styles.message}>
          <Image source={require('../../imgs/user.png')} style={styles.userImage} />
          <Text>{other_participate_name}</Text>
        </View>
      </TouchableOpacity >
    )
  }

  render(){

    if (this.props.loading) {
      return (
        <View style={styles.container}>
          <SmallSpinner />
        </View>
        );
    }

    return(
      <View style={styles.container}>

        <FlatList
          style={styles.container2}
          data={this.state.chats}
          renderItem={this.itemRender}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={this.refresh_messages}
          refreshing={this.state.refreshing}
        />

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  message:{
    flex: 1,
    flexDirection:'row',
    height:60,
    borderBottomColor:'#333333',
    borderBottomWidth:1,
    padding:5,
    paddingLeft:10,
    paddingRight:10,
    marginTop:10,
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
    error: state.getMessagesReducer.error,
    loading: state.getMessagesReducer.loading,
    data: state.getMessagesReducer.data
  }
}

export default connect(mapStateToProps , { getMessages })(Messages_page);
