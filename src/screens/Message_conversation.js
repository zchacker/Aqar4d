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
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
  Vibration
} from 'react-native';

import {BASE_URL}  from './base_url';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner } from '../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const DURATION = 100;

class Message_conversation extends React.Component{

  static navigationOptions = {
    title: 'Home',
  };

  constructor(){
    super();
    this.state = {
      username: '',
      loading:true,
      refreshing:false,
      to_user_id:'',
      messages:[],
      message_body:'',
    }
  }

  componentDidMount(){

    AsyncStorage.getItem('logged_in')
    .then(token => {
        if (token != 'yes'){
          this.props.navigation.navigate('Register');
        }else{

          this.get_messages();

          this.props.navigation.navigationOptions = ({ navigation }) => ({
              title: this.state.username,
          });

          // this.props.navigation.setParams({ title: this.state.username })
          // console.log('chat with : ' , this.state.username )

        }
    });


  }

  UNSAFE_componentWillMount() {
      const  params  = this.props.navigation.state.params;
      this.setState({
        to_user_id : params.user_id,
        username: params.username,
      })
  }

  get_messages = async () => {

    this.setState({ refreshing: true })

    let from_user_id  = await AsyncStorage.getItem('user_id');
    let url = BASE_URL + 'get_messages/'+from_user_id+'/'+this.state.to_user_id

    axios.get(url)
      .then(response => this.hendelResponse(response))
      .catch(error => console.error( error));

  }

  hendelResponse = (response) => {
    this.setState({messages: response.data.messages , loading:false , refreshing: false})
  }

  send_messages = async () => {

    let from_user_id  = await AsyncStorage.getItem('user_id');
    let to_user_id    = this.state.to_user_id;
    let message_body  = this.state.message_body;

    if(message_body.length > 0){
      let url = BASE_URL + 'add_message';

      let form_data = new FormData();
      form_data.append('from_user', from_user_id);
      form_data.append('to_user', to_user_id);
      form_data.append('body', this.state.message_body);

      axios.post(url,form_data)
        .then(response => this.response_sent_msg(response))
        .catch(error => console.error( error));
    }

  }

  response_sent_msg = (response) => {
    if(response.data.success){
      console.log('messages ' , response.data.messages);
      this.setState({
        message_body: '',
        messages: this.state.messages.concat(response.data.messages),
      })
      Vibration.vibrate(DURATION) ;
      //Vibration.cancel();

    }
  }

  showAlert = () => {
    // Works on both iOS and Android
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  renderItem = ({ item }) => {
      let box_style = item.isCurrentUser ? 'current_user_msg' : 'other_user_msg';
      let username_style =  item.isCurrentUser
        ? 'current_user_username'
        : 'other_user_username';

      return (
        <View key={item.key} style={styles.msg}>
          <View style={styles.msg_wrapper}>
            <View style={styles.username}>
              <Text style={[styles.username_text, styles[username_style]]}>
                {item.username}
              </Text>
            </View>
            <View style={[styles.msg_body, styles[box_style]]}>
              <Text style={styles[`${box_style}_text`]}>{item.msg}</Text>
            </View>
          </View>
        </View>
      );
  };

  render(){
    //console.log(this.state.messages)
    if(this.state.loading){
      return(
          <View style={styles.spinnerContainer}>
            <Spinner/>
          </View>
      )
    }
    return(
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={false} >
        <View style={styles.body}>
            <ScrollView
              style={styles.messages}
              contentContainerStyle={styles.scroll_container}
              onContentSizeChange={(contentWidth, contentHeight)=>{
                  this.scrollView.scrollToEnd({animated: true});
                  //console.log('scroll view ' , this.scrollView);
              }}
               ref={ref => this.scrollView = ref}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.get_messages}
              />
            }>
              <FlatList data={this.state.messages} renderItem={this.renderItem} />
            </ScrollView>

            <View style={styles.message_box}>
              <TextInput
                  style={styles.text_field}
                  multiline={true}
                  onChangeText={(message) => this.setState({ message_body: message }) }
                  value={this.state.message_body}
                  placeholder="اكتب رسالتك..."
                />
                <View style={styles.button_container}>

                  <TouchableOpacity onPress={this.send_messages}>
                    <View style={styles.send_button}>
                      <Text style={styles.send_button_text}>أرسل</Text>
                    </View>
                  </TouchableOpacity>

                </View>
            </View>

        </View>
      </KeyboardAvoidingView>
    )
  }

}

// this one messages

// <ScrollView
//   style={styles.messages}
//   contentContainerStyle={styles.scroll_container}
//   ref={this.props.setScrollViewRef}
//   refreshControl={
//     <RefreshControl
//       refreshing={this.props.refreshing}
//       onRefresh={this.props.loadPreviousMessages}
//     />
//   }>
// </ScrollView>

const styles = StyleSheet.create({
  spinnerContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 10,
    alignSelf: 'stretch',
  },
  leave_button: {
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  leave_button_text: {
    color: '#FFF',
    fontSize: 16,
  },
  body: {
    flex: 9,
  },
  scroll_container: {
    paddingBottom: 20,
  },
  messages: {
    flex: 8,
    flexDirection: 'column',
    padding: 8,
  },
  current_user_msg: {
    backgroundColor: '#439bff',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  current_user_msg_text: {
    color: '#fff',
  },
  current_user_username: {
    opacity: 0,
  },

  other_user_msg: {
    backgroundColor: '#f6f8fa',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  other_user_msg_text: {
    color: '#333',
  },
  other_user_username: {
    color: '#484848',
  },
  message_box: {
    flex: 0.1,
    flexDirection: 'row',
    padding: 10,
    marginBottom:7,
    // borderBottomColor: '#B89F03',
    // borderBottomWidth: 3,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    justifyContent: 'space-between',
  },
  username: {
    marginTop: 15,
  },
  username_text: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 5,
  },
  msg_body: {
    flex: 10,
    padding: 8,
    borderRadius: 10,
    maxWidth: 250,
  },
  typing_indicator: {
    padding: 5,
  },
  typing_indicator_text: {
    fontSize: 10,
    color: '#ccc',
  },
  text_field: {
    height: 40,
    flex: 8,
    // borderColor:'gray',
    // borderWidth: 1 ,
  },
  button_container: {
    flex: 2,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  send_button_text: {
    color: '#0064e1',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default connect(null , { loginUser })(Message_conversation);
