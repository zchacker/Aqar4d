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
} from 'react-native';

import {BASE_URL}  from './base_url';
import { editProfile , profileData } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , Input , Card , CardItem , SettingsButton} from '../components';
import AsyncStorage from '@react-native-community/async-storage';

class Edit_my_profile extends Component{

  constructor(){
    super();
    this.state = {
      name: '',
      phone:'',
      email:'',
    }
  }

  componentDidMount(){
    this.getMyData()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.userData){
      console.log('edit profile')
      console.log(nextProps.userData)
      this.setState({name: nextProps.userData.name , phone: nextProps.userData.phone ,  email: nextProps.userData.email })
    }
  }

  save_data = () => {
    const { name , phone , email } = this.state;
    this.props.editProfile({ name , phone , email });
  }

  getMyData = () => {
    // editProfile
    this.props.profileData();
  }

  getToken = async () => {
    var retrievedItem =  await AsyncStorage.getItem('app_token');
    console.log( retrievedItem );
    // console.log('get token')
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
          <Text style={styles.errortext}>
            {this.props.error}
          </Text>
          <Spinner />
        </View>
        );
    }else{
      return(
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>

              <ScrollView style={styles.scrollStyle}>
                <View style={styles.title}>
                  <Text style={styles.titleText} >أضف بيانات عقارك</Text>
                </View>

                <Card>
                  <CardItem>
                    <Input
                      label='اسمك'
                      placeholder='اكتب اسمك'
                      secureTextEntry={false}
                      onChangeText={(name) => this.setState({ name  }) }
                      value={this.state.name}
                    />
                  </CardItem>

                  <CardItem>
                    <Input
                      label='رقم هاتفك'
                      placeholder='+96654XXXXXXXXX'
                      secureTextEntry={false}
                      onChangeText={(phone) => this.setState({ phone  }) }
                      value={this.state.phone}
                    />
                  </CardItem>

                  <CardItem>
                    <Input
                      label= 'بريدك الالكتروني'
                      placeholder= 'example@gmail.com'
                      secureTextEntry={false}
                      onChangeText={(email) => this.setState({ email  }) }
                      value={this.state.email}
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

export default connect(mapStateToProps , { editProfile , profileData })(Edit_my_profile);
