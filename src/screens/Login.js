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
  BackHandler,
  ToastAndroid
} from 'react-native';

import {BASE_URL}  from './base_url';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , SettingsButton } from '../components';

class Login extends Component{

  constructor(){
    super();
    this.state = {
      email: '',
      password:''
    }
  }

  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
      //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
      return true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      //console.log('i get props : ' + nextProps.user.email)
      console.log('this is props : ' + nextProps.user);
      this.props.navigation.replace('MainTab');
    }
  }

  _onLoginPressed() {
    const { email, password } = this.state;
    this.props.loginUser({ email, password });
  }

  _renderButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button onPress={this._onLoginPressed.bind(this)}>تسجيل الدخول</Button>
    );
  }

  // <Image
  //   style={styles.logoImg}
  //   source={require('../../imgs/icon.png')}
  // />

  // <Text style={styles.logoText}>Aqar4D</Text>

  render(){
    return (
      <SafeAreaView style={styles.container} >
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={false} >
            <StatusBar backgroundColor="rgb(32 , 53 , 70)" barStyle="light-content" />

            <View style={styles.logo}>
              <Image
                style={styles.logoImg}
                source={require('../../imgs/icon.png')}
              />
              <View style={styles.error_wrap}>
                <Text style={styles.errortext}>
                  {this.props.error}
                </Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <TextInput
                 style={styles.input}
                 placeholder="ادخل الرقم او البريد الالكتروني"
                 placeholderTextColor= "#666666"
                 returnKeyType='next'
                 autoCorrect={false}
                 onChangeText={(email) => this.setState({ email  }) }
                 onSubmitEditing={()=> this.refs.txtPass.focus()}
               />

               <TextInput
                  style={styles.input}
                  placeholder="كلمة المرور"
                  placeholderTextColor= "#666666"
                  returnKeyType='go'
                  secureTextEntry
                  autoCorrect={false}
                  onChangeText={( password ) => this.setState({ password  }) }
                  ref={"txtPass"}
                />


                <View style={styles.buttonWrap}>
                  { this._renderButton() }
                </View>

                <Text style={styles.registerLink}
                    onPress={() =>{this.props.navigation.replace('Register');}}
                >
                  هل أنت غير مشترك؟ اضغط هنا للتسجيل
                </Text>

                <View style={styles.buttonWrap}>
                  <SettingsButton onPress={() =>{this.props.navigation.replace('MainTab');}} color={'#1365AE'}> التصفح كزائر </SettingsButton>
                </View>

            </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'rgb(32 , 53 , 70)',
    flexDirection: 'column',
  },
  infoContainer:{
    flex:3,
    padding:20,
    // position:'absolute',
    // left:0,
    // right:0,
    // bottom:0,
    // height:370,
    // padding:20,
    // backgroundColor: 'red',
  },
  title:{

  },
  logo:{
    flex: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20,
    marginTop:50,
    // alignItems: 'center',
    // position:'absolute',
    // left:0,
    // right:0,
    // top:0,
    // height:150,
    // padding:20,
    // zIndex:0,
  },
  logoText:{
    fontSize:40,
    fontWeight:'bold',
    color:'#FFFFFF',
  },
  input:{
    borderRadius: 5,
    height:40,
    marginBottom:20,
    backgroundColor :'#ffffff',
    borderWidth:0,
    paddingHorizontal:10,
    textAlign:'right',
  },
  buttonContainer:{
    backgroundColor :'#f8eb28',
    paddingVertical:15,
  },
  buttonText:{
    textAlign:'center',
    color: '#000000',
    fontWeight:'bold',
    fontSize:18,
  },
  logoImg:{
    width:140,
    height:140,
  },
  registerLink:{
    color:'#ffffff',
    fontSize:16,
    textAlign:'center',
    marginTop:20,
  },
  buttonWrap:{
    height: 40,
    marginVertical: 10,
  },
  error_wrap:{
    borderRadius:5,
    // backgroundColor:'#ffffff',
    marginVertical:10,
    marginHorizontal:10,
    paddingVertical:2,
    paddingHorizontal:2,
  },
  errortext:{
    color:'#F14817',
    fontSize:16,
  }
})


const mapStateToProps = state => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    user: state.auth.user
  }
}

export default connect(mapStateToProps , { loginUser })(Login);

// <TouchableOpacity style={styles.buttonContainer}>
//   <Text style={styles.buttonText} >تسجيل الدخول</Text>
// </TouchableOpacity>
