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
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

class Profile_page extends Component{

  constructor(){
    super();
    this.state = {
      entitis: [],
      refreshing:false,
      my_name:'',
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('logged_in')
    .then(token => {
        if (token != 'yes'){
          this.props.navigation.navigate('Register');
        }else{
          this._load_entities();
        }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.entities){
      console.log('we get entities data' , nextProps)
      this.setState({
        entitis : nextProps.entities.entities ,
        refreshing: false ,
        my_name: nextProps.entities.my_name
      })

    }
  }

  _load_entities = () => {
    this.props.load_entities();
  }

  refresh_entities = () => {
    this.setState({refreshing: true})
    this.props.load_entities();
  }

  logout = () => {
      AsyncStorage.removeItem('app_token');
      AsyncStorage.removeItem('user_id');
      AsyncStorage.removeItem('logged_in');
      this.props.navigation.navigate('Login');
  }

  showAlert = () => {
    // Works on both iOS and Android
    Alert.alert(
      'تنبيه!',
      'هل تريد فعلا تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'موافق', onPress: () => this.logout() },
      ],
      {cancelable: false},
    );
  }

  _goToEditProfile = () => {
    //console.log("go to edit 3")
    this.props.navigation.push('edit_my_profile');
  }

  _goToEditPassword = () => {
    //console.log("go to edit 4")
    this.props.navigation.push('edit_password');
  }

  entity_render = ({item}) => {
    return(
      <TouchableOpacity
        onPress={ () => this.props.navigation.push( 'Details_page', { entity_id: item.id }) }  >
        <View style={styles.adContainer}>
          <View style={styles.adInfo}>
            <View><Text style={styles.adTitle} >{item.title}</Text></View>
            <View><Text style={styles.adDate} >التاريخ : {item.add_time}</Text></View>
            <View><Text style={styles.adPrice} > {item.price} ريال </Text></View>
            <View style={styles.adLocationContainer} >

              <Icon name={'map-marker'} size={28} color={'#D3AD10'}  style={styles.adAddressIcon} />
              <Text style={styles.adAddress} > {item.city} - {item.country} </Text>

            </View>
          </View>
          <View>

            {item.soldout == 1 ?
                <View style={styles.sold}>
                  <Text style={styles.soldText} >تم البيع</Text>
                </View>
               :
               null
            }

            <FastImage
                style={styles.adImg}
                source={{
                    uri: UPLOAD_URL+item.photo,
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // <View style={styles.logoutHeader} >
  //
  //   <Text> خروج </Text>
  //   <TouchableNativeFeedback onPress={this.showAlert} >
  //       <Image source={require('../../imgs/logout.png')} style={styles.userImage} />
  //   </TouchableNativeFeedback>
  //
  // </View>

  // <View style={styles.settingHeader} >
  //   <SettingsButton color={'#B89F03'} onPress={this._goToEditPassword} >تغير كلمة المرور</SettingsButton>
  //   <SettingsButton color={'#B89F03'} onPress={this._goToEditProfile}  >تعديل بياناتي</SettingsButton>
  // </View>

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
    }

    return(
      <View style={styles.container}>

          <View style={styles.header}>
            <View style={styles.userInfoHeader}>
              <Image source={require('../../imgs/user.png')} style={styles.userImage} />
              <Text style={styles.userName} >{this.state.my_name}</Text>
            </View>
          </View>

          <FlatList
            style={styles.container}
            data={this.state.entitis}
            renderItem={this.entity_render}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.refresh_entities}
            refreshing={this.state.refreshing}
          />



      </View>
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
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  spinnerContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
  },
  scrollStyle:{
    // flex: 1,
    // paddingLeft:18,
    // paddingRight:18,
  },
  settingHeader:{
    flexDirection:'row',
    // position:'absolute',
    // top:0,
    // right:0,
    // left:0,
    height:35,
    // width:'100%',
    backgroundColor:'#ffffff',
    padding:5,
    marginBottom:5,
    marginTop:5,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    // position:'absolute',
    // top:0,
    // right:0,
    // left:0,
    height:40,
    // width:'100%',
    backgroundColor:'#ffffff',
    padding:5,
    paddingLeft:20,
    marginTop:5,
    marginBottom:5,
  },
  userInfoHeader:{
    flexDirection:'row',
    alignItems: 'center',
  },
  logoutHeader:{
    marginRight:20,
    flexDirection:'row',
    justifyContent:'space-between',
  },
  userImage:{
    width:25,
    height:25,
    // flex:1,
  },
  userName:{
    marginTop:2,
    marginLeft:20,
    fontSize:20,
    // flex:3 ,
  },
  adContainer:{
    flexDirection:'row-reverse',
    height:160,
    padding:10,
    marginTop:10,
    marginBottom:10,
    marginRight:7,
    marginLeft:7,
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderRadius:5,
    borderColor: '#333333',
  },
  adInfo:{
    flex:3,
  },
  adTitle:{
    fontSize:15,
    fontWeight:'bold',
  },
  adDate:{
    color:'#737372',
    marginBottom:10,
  },
  adPrice:{
    color:'#B82403',
  },
  adLocationContainer:{
    flexDirection:'row-reverse',
    marginTop:10,
  },
  adAddressIcon:{
    marginLeft:5,
  },
  adAddress:{
    fontSize:16,
    color:'#0F5606',
  },
  adImg:{
    borderRadius:7,
    width:140,
    height:140,
    backgroundColor:'#F3EDCE',
  },
  sold:{
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:40,
    left:0,
    height:40,
    width:70,
    backgroundColor:'red',
    zIndex: 5,
    marginTop: -35,
  },
  soldText:{
    color:'#ffffff',
    fontSize:20,
    fontWeight:'bold',
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

export default connect(mapStateToProps , { loginUser , load_entities })(Profile_page);
