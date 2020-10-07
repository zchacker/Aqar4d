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
  Alert,
  Vibration
} from 'react-native';

import {BASE_URL}  from './base_url';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import { Button , SettingsButton , Spinner , SmallSpinner } from '../components';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image'
import MapView,  { PROVIDER_GOOGLE , Marker} from 'react-native-maps';
import Video from 'react-native-video';

const DURATION = 700;

class Details_page extends Component{

  constructor(){
    super();
    this.state = {
      loading: true,
      success: false,
      user_id:'',
      entity_id:'',
      title:'',
      adviserName:'',
      add_by:'',
      add_time:'',
      price:'',
      space:'',
      country:'',
      province:'',
      city:'',
      neighborhood:'',
      description:'',
      type:'',
      lat:'',
      lng:'',
      phone:'',
      email:'',
      photos:[],
      video:null,
      location:{latitude: 24.713000 , longitude: 46.855451},
      region:{
        latitude:  24.713000 ,
        longitude: 46.855451 ,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    }
  }

  async componentDidMount(){
    this.get_entity_data()
    let user_id  = await AsyncStorage.getItem('user_id');
    this.setState({user_id: user_id})
  }

  UNSAFE_componentWillMount() {
      const  params  = this.props.navigation.state.params;
      this.setState({entity_id : params.entity_id})
      console.log('the entity id is ' , params.entity_id )
  }

  _goToConversion = () => {
    this.props.navigation.navigate('Message_conversation' , { user_id: this.state.add_by });
  }

  confirem_delete_this_entity = () => {
    Vibration.vibrate(DURATION);
    Alert.alert(
      'تحذير',
      'هل تريد فعلا حذف هذا العقار؟',
      [
        {text: 'موافق', onPress: () => this.delete_this_entity() },
        {text: 'إلغاء', style: 'cancel',  onPress: () => console.log('Cancel Pressed')},
      ],
      {cancelable: false},
    );
  }

  delete_this_entity = () => {
    let our = this;

     // Call the back-end API
    let url = BASE_URL + 'delete_enetity/'
    let entity_id = this.state.entity_id;

    let form_data = new FormData();
    form_data.append('entity_id' , entity_id);

    axios.post( url ,form_data )

      .then(function (response){
        console.log('delete data ' , response.data.success);

        if(response.data.success == true){
          our.setState({
            success: true,
            loading:false,
          })

          our.props.navigation.navigate('Home');

        }else{

          Alert.alert(
            'تحذير',
            'خطأ لم يتم الحذف بنجاج!!',
            [
              {text: 'موافق', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        }

      })
      .catch(function (error) {
         // handle error
         console.log(error);

         our.setState({
           success: false,
           loading:false,
         })

         Alert.alert(
           'تحذير',
            'خطأ لم يتم الحذف بنجاج!!',
           [
             {text: 'موافق', onPress: () => console.log('OK Pressed')},
           ],
           {cancelable: false},
         );

       })
       .finally(function () {
         // always executed
         our.setState({
           success: false,
           loading:false,
         })
       });
  }

  soldout_this_entity = () => {
    let our = this;

    our.setState({
      success: false,
      loading: true,
    })

     // Call the back-end API
    let url = BASE_URL + 'entity_soldout/'
    let entity_id = this.state.entity_id;

    let form_data = new FormData();
    form_data.append('entity_id' , entity_id);

    axios.post( url ,form_data )

      .then(function (response){
        console.log('delete data ' , response.data.success);

        if(response.data.success == true){

          //our.props.navigation.navigate('Home');

          Alert.alert(
            'مبروك',
            'تم وضع علامة تم البيع على العقار',
            [
              {text: 'موافق', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );

          our.setState({
            success: true,
            loading: false,
          })

        }else{

          Alert.alert(
            'تحذير',
            'لم يتم الطلب بنجاح, حاول مرة أخرى',
            [
              {text: 'موافق', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );

        }

      })
      .catch(function (error) {
         // handle error
         console.log(error);

         our.setState({
           success: false,
           loading:false,
         })

         Alert.alert(
           'تحذير',
            'خطأ لم يتم الحذف بنجاج!!',
           [
             {text: 'موافق', onPress: () => console.log('OK Pressed')},
           ],
           {cancelable: false},
         );

       })
       .finally(function () {
         // always executed
         our.setState({
           success: true,
           loading:false,
         })

       });
  }

  edit_this_entity = () => {
    Vibration.vibrate(70);
    this.props.navigation.replace( 'Edit_enetity', { entity_id: this.state.entity_id} )
  }

  get_entity_data = () => {
    let our = this;
     // Call the back-end API
    let url = BASE_URL + 'get_entity/'
    axios.get( url + this.state.entity_id)
     .then(function (response) {
        console.log('Entity data : ' , response);
        our.setState({
          success: response.data.success,
          loading:false,
          title: response.data.title,
          type: response.data.type,
          photos: response.data.photos,
          video: response.data.video,
          adviserName: response.data.adviserName,
          add_by: response.data.add_by,
          price: response.data.price,
          space: response.data.space,
          country: response.data.country,
          province: response.data.province,
          city: response.data.city,
          neighborhood: response.data.neighborhood,
          phone: response.data.phone,
          email: response.data.email,
          add_time: response.data.add_time,
          add_by: response.data.add_by,
          lat: response.data.lat,
          lng: response.data.lng ,
          location:{latitude: Number(response.data.lat) , longitude: Number(response.data.lng) },
          region:{
            latitude:  Number(response.data.lat) ,
            longitude: Number(response.data.lng) ,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          description: response.data.description,
        })
     })
     .catch(function (error) {
       // handle error
       console.log(error);
       our.setState({
         success: false,
         loading:false,
       })
     })
     .finally(function () {
       // always executed
     });
  }

  _renderVideo = () => {
    if(this.state.video != null){
      console.log("video path : " + this.state.video)
      return(
          <Video source={{uri: this.state.video}}   // Can be a URL or a localfile.
            ref={(ref) => {
              this.player = ref
            }}                                      // Store reference
            onBuffer={this.onBuffer}                // Callback when remote video is buffering
            onEnd={this.onEnd}                      // Callback when playback finishes
            onError={this.videoError}               // Callback when video cannot be loaded
            style={styles.backgroundVideo}
            controls={true}
            paused={true}/>
      );
    }
  }

  renderPhotos = () => {
    if(this.state.photos && this.state.photos.length > 0){
      return(
        this.state.photos.map( (item, key) => {
            return(
              <FastImage
                  key={key}
                  style={styles.adImg}
                  source={{
                      uri: item,
                      headers: { Authorization: 'someAuthToken' },
                      priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
              />
            )
        })
      );
    }
  }

  renderSendButton =  () => {

    let user_id  = this.state.user_id;
    let add_by   = this.state.add_by;

    if(user_id != add_by){
      return(
          <SettingsButton color={'#047C2F'} onPress={this._goToConversion} >راسل المعلن</SettingsButton>
      );
    }

  }

  renderControlButton = () => {
    let user_id  = this.state.user_id;
    let add_by   = this.state.add_by;

    if(user_id === add_by){
      return(
          <View>
            <View style={styles.control_button}>
              <SettingsButton color={'#E25227'} onPress={this.confirem_delete_this_entity} > حذف هذا العقار </SettingsButton>
            </View>
            <View style={styles.control_button}>
              <SettingsButton color={'#F3B048'} onPress={this.soldout_this_entity} > هذا العقار مباع </SettingsButton>
            </View>
            <View style={styles.control_button}>
              <SettingsButton color={'#F7DE29'} onPress={this.edit_this_entity} > تعديل العقار </SettingsButton>
            </View>
          </View>
      );
    }
  }

  renderView = () => {

    if(this.state.loading){
      return(
        <View style={styles.container}>
          <SmallSpinner />
        </View>
      )
    }

    if(this.state.success == false){
      return(
        <View style={styles.errorContainer}>
          <Text style={styles.error_message}> عفوا هذا العرض تم حذفه </Text>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewStyle}>

          <View style={styles.titleWrap}>
            <Text style={styles.title} >{this.state.title}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} ><Text style={styles.bold}>المعلن: </Text> {this.state.adviserName}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} ><Text style={styles.bold}>تاريخ الاعلان: </Text>{this.state.add_time}</Text>

          </View>


          <View style={styles.box}>
            <Text style={styles.boxItem} ><Text style={styles.bold}>رقم الاعلان: </Text> {this.state.entity_id}</Text>
            <Text style={styles.boxItem} ><Text style={styles.bold}>النوع: </Text> {this.state.type}</Text>
          </View>

          <View style={styles.box}>
            <Text style={ [styles.boxItem]} >
              <Text style={styles.bold}>الدولة: </Text>
              <Text> <Icon name={'map-marker'} size={14} color={'#047C2F'}  style={styles.adAddressIcon} /> </Text>
              {this.state.country}
            </Text>
            <Text style={styles.boxItem} ><Text style={styles.bold}>المدينة: </Text>{this.state.city}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} >
            <Text style={styles.bold}>الحي : </Text>
            {this.state.neighborhood}
            </Text>
            <Text style={styles.boxItem} ><Text style={styles.bold}>المحافظة: </Text>{this.state.province}</Text>
          </View>

          <View style={styles.box}>

            <Text style={styles.boxItem} >

              <Text style={styles.bold}>السعر: </Text>
              {this.state.price}
              <Text> <Icon name={'money'} size={14} color={'#047C2F'}  style={styles.adAddressIcon} /> </Text>

              <Text style={styles.boxItem} > <Text style={styles.bold}>المساحة: </Text> {this.state.space}</Text>

            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} ><Text style={styles.bold}>التفاصيل:- </Text></Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} >{this.state.description}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxItem} >الصور: - </Text>
          </View>

          <View style={styles.container}>
            {this.renderPhotos()}
          </View>



          <View style={styles.box}>
            {this._renderVideo()}
          </View>

          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={this.state.region}
            zoomControlEnabled={false}
            maxZoomLevel={20}
            mapType={"hybrid"}
          >
             <Marker
               draggable={false}
               coordinate={this.state.location}
               title={'موقع العقار على الخريطة'}
             />
          </MapView>


          <View style={styles.message_button} >
            {this.renderSendButton()}
          </View>

          <View style={styles.message_button} >
            {this.renderControlButton()}
          </View>

        </ScrollView>
      </View>
    )
  }

  render(){
    return (this.renderView())
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error_message:{
    color:'red',
    fontSize:18,
  },
  scrollViewStyle:{
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  titleWrap:{
    marginTop:10,
    marginBottom:20,
    marginLeft:0,
    marginRight:20,
  },
  title:{
    fontSize:20,
    fontWeight:'bold',
    textAlign:'right',
  },
  box:{
    flex: 1,
    flexDirection:'row',
    marginLeft:5,
    marginRight:5,
    marginTop:10,
    marginBottom:10,
     justifyContent: 'center'
  },
  boxItem:{
    flex: 2,
    fontSize:18,
    fontWeight:'900',
    textAlign:'right',
  },
  bold:{
    fontWeight:'bold',
    color:'#F79E45'
  },
  adAddressIcon:{
    marginLeft:5,
    marginRight:5,
  },
  adImg:{
    flex:1,
    marginLeft:20,
    marginRight:20,
    marginTop:30,
    borderRadius:7,
    // width:140,
    height:400,
  },
  message_button:{
    marginTop:70,
    marginBottom:70,
  },
  control_button:{
    marginTop:20,
    marginBottom:20,
  },
  backgroundVideo:{
    // height:250,
    width:'95%',
    height:380,
    marginRight:10,
    marginLeft:10,
    marginTop:20,
    // marginBottom:20,

  },
  map:{
    backgroundColor :'#ffffff',
    width:'90%',
    height:320,
    margin:30,
    marginRight:20,
    marginLeft:20,
    justifyContent: 'center',
  },
});

export default connect(null , { loginUser })(Details_page);
