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
  ScrollView,
  Alert
} from 'react-native';

import {BASE_URL}  from './base_url';
import { editProfile , profileData , edit_password } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , Input , Card , CardItem , SettingsButton} from '../components';
import AsyncStorage from '@react-native-community/async-storage';

class Edit_password extends Component{

  constructor(){
    super();
    this.state = {
      old_pass: '',
      new_pass:'',
      error_msg:'',
      success_msg:'',
    }
  }

  componentDidMount(){

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(!nextProps.btn_loading){
      //console.log('edit password')
      //console.log(nextProps.userData)
      if(!nextProps.userData){
        this.setState({error_msg: 'كلمة المرور خطأ'});
      }else {
        this.setState({success_msg: 'تم التعديل بنجاح' });
      }
    }

    //console.log(nextProps)
  }

  showAlert = () => {
    // Works on both iOS and Android
    Alert.alert(
      'خطأ',
      'الرجاء ملئ جميع الخانات',
      [
        {text: 'موافق', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  save_data = () => {

    if(this.state.old_pass.length == 0 || this.state.new_pass.length == 0){
      this.showAlert()
    }else{
      this.setState({error_msg: ''});
      const { old_pass , new_pass  } = this.state;
      this.props.edit_password({ old_pass , new_pass });
    }

  }

  getMyData = () => {
    // editProfile
    this.props.profileData();
  }

  getToken = async () => {
    var retrievedItem =  await AsyncStorage.getItem('app_token');
    console.log( retrievedItem );
  }

  _button_render(){
      if (this.props.btn_loading) {
        return(
          <Spinner />
        );
      }
      return(
        <SettingsButton color={'#68B803'} onPress={this.save_data}> حفظ بياناتك </SettingsButton>
      );
  }

  _view_render(){

    if (this.props.loading) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      );
    }

    return(
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>

              <ScrollView style={styles.scrollStyle}>
                <View style={styles.title}>
                  <Text style={styles.titleText} >عدل كلمة المرور</Text>
                </View>

                <Text style={styles.errortext}>
                  {this.state.error_msg}
                </Text>

                <Text style={styles.successtext}>
                  {this.state.success_msg}
                </Text>

                <Card>
                  <CardItem>
                    <Input
                      label='كلمة المرور القديمة'
                      placeholder= ''
                      secureTextEntry={false}
                      onChangeText={(old_pass) => this.setState({ old_pass  }) }
                      value={this.state.name}
                    />
                  </CardItem>

                  <CardItem>
                    <Input
                      label= 'كلمة المرور الجديدة'
                      placeholder= ''
                      secureTextEntry={false}
                      onChangeText={(new_pass) => this.setState({ new_pass  }) }
                      value={this.state.phone}
                    />
                  </CardItem>

                  <CardItem>
                    {this._button_render()}
                  </CardItem>

                </Card>
              </ScrollView>

          </View>
        </SafeAreaView>
      );

  }


  render(){
    return(
      this._view_render()
    )
  }

}

const styles = StyleSheet.create({
  container:{
    // flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
  },
  spinnerContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
  },
  keyboardAvoidingView:{
    backgroundColor:'#333333',
    flex:1,
  },
  scrollStyle:{
    paddingLeft:18,
    paddingRight:18,
  },
  map:{
    backgroundColor :'#ffffff',
    // width:300,
    height:320,
    marginRight:10,
    marginLeft:10,
  },
  title:{
    marginTop:10,
    marginBottom:10,
  },
  titleText:{
    fontSize:24,
    textAlign:'center'
  },
  selectImgBtn:{
    marginTop:10,
    marginBottom:10,
  },
  saveBTN:{
    marginTop:10,
    marginBottom:60,
  },
  imgBox:{
    marginTop:20,
    marginBottom:20,
  },
  errortext:{
    color:'red',
    fontSize:16,
    textAlign: 'center',
  },
  successtext:{
    color:'green',
    fontSize:16,
    textAlign: 'center',
  }
});

const mapStateToProps = state => {
  return {
    error: state.profileData.error,
    loading: state.profileData.loading,
    userData: state.profileData.userData,
    btn_loading: state.profileData.btn_loading
  }
}

export default connect(mapStateToProps , { editProfile , profileData , edit_password })(Edit_password);
