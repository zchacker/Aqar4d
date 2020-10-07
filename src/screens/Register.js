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
  Picker,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native';

import { registerUser } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner, SmallSpinner } from '../components';

class Register extends Component{

  constructor(){
    super();
    this.state = {
      name: '',
      type: '',
      email: '',
      phone: '' ,
      password: '',
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
      this.props.navigation.replace('Login');
    }
    console.log('this is props : ' , nextProps);
  }



  _onRegisterPressed() {
    const {name, type, email , phone , password} = this.state;
    this.props.registerUser({name, type, email , phone , password});
  }

  _renderButton() {

    if (this.props.loading) {
      return <SmallSpinner />;
    }

    return (
      <Button onPress={this._onRegisterPressed.bind(this)}>الاشتراك بالتطبيق</Button>
    );
  }

  render(){
    return (
        <SafeAreaView style={styles.container} >
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={true} >
            <StatusBar backgroundColor="rgb(32 , 53 , 70)" barStyle="light-content" />
            <View style={styles.logo}>
              <Image
                style={styles.logoImg}
                source={require('../../imgs/icon.png')}
              />

              <Text style={styles.errortext}>
                {this.props.error}
              </Text>

            </View>

            <View style={styles.infoContainer}>
              <TextInput
                 style={styles.input}
                 placeholder="اسمك"
                 placeholderTextColor= "#666666"
                 returnKeyType='next'
                 autoCorrect={false}
                 onChangeText={( name ) => this.setState({ name  }) }
                 onSubmitEditing={()=> this.refs.txtPass.focus()}
               />

               <Picker
                 selectedValue={ this.state.type }
                 style={styles.input}
                 onValueChange={ (itemValue, itemIndex) => this.setState({ type: itemValue  }) }
               >
                  <Picker.Item label={'أفراد'} key={1} value={1} />
                  <Picker.Item label={'شركات'} key={2} value={2} />
               </Picker>


               <TextInput
                  style={styles.input}
                  placeholder="بريدك الالكتروني"
                  placeholderTextColor= "#666666"
                  returnKeyType='next'
                  autoCorrect={false}
                  onChangeText={( email ) => this.setState({ email  }) }
                  keyboardType={'email-address'}
                  onSubmitEditing={()=> this.refs.txtPass.focus()}
                />


                <TextInput
                   style={styles.input}
                   placeholder="+9665xxxxxx"
                   placeholderTextColor= "#666666"
                   returnKeyType='next'
                   autoCorrect={false}
                   onChangeText={( phone ) => this.setState({ phone  }) }

                   onSubmitEditing={()=> this.refs.txtPass.focus()}
                 />

               <TextInput
                  style={styles.input}
                  placeholder="كلمة المرور"
                  placeholderTextColor= "#666666"
                  returnKeyType='go'
                  onChangeText={( password ) => this.setState({ password  }) }
                  secureTextEntry
                  autoCorrect={false}
                  ref={"txtPass"}
                />

                <View style={styles.buttonWrap}>
                  { this._renderButton() }
                </View>

                <Text style={styles.registerLink}
                    onPress={() =>{this.props.navigation.replace('Login');}}
                  >
                  هل أنت مشترك؟ اضغط هنا للدخول
                  </Text>

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
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    height:450,
    padding:20,
    marginTop:20,
    // backgroundColor: 'red',
    // position:'absolute',
    // left:0,
    // right:0,
    // bottom:0,
    // height:400,
    // padding:20,
    // backgroundColor: 'red',
  },
  title:{

  },
  logo:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:410,
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginBottom:20,
    // alignItems: 'center',
    // position:'absolute',
    // left:0,
    // right:0,
    // top:0,
    // height:150,
    // padding:20,
    // zIndex:0,
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
    width:100,
    height:100,
  },
  registerLink:{
    color:'#ffffff',
    fontSize:16,
    textAlign:'center',
    marginTop:20,
  },
  buttonWrap:{
    height: 40,
    marginVertical: 5,
  },
  errortext:{
    color:'#ffffff',
    fontSize:16,
    marginTop:8,
    marginBottom:8,
  }
})


const mapStateToProps = state => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    user: state.auth.user
  }
}

export default connect(mapStateToProps , { registerUser })(Register);
