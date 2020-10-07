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
  PermissionsAndroid,
  ScrollView,
  Picker,
  Alert,
  Vibration
} from 'react-native';

import axios from 'axios';
import {BASE_URL}  from './base_url';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import MapView,  { PROVIDER_GOOGLE , Marker} from 'react-native-maps';
import { Button , Spinner , Input ,  Card , CardItem , SmallSpinner } from '../components';
import AsyncStorage from '@react-native-community/async-storage';

const PATTERN = [100 , 200 , 100 , 200]

class Edit_enetity extends Component{

  constructor(){
    super();
    this.state = {
      loading: true,
      success: false,
      updating:false,
      user_id:'',
      app_token:'',
      entity_id:'',

      adTypeData: ['بيع' , 'شراء' , 'إيجار'],
      typeData: ['اختر نوع العقار' , 'شقة' , 'أرض' , 'منزل'],
      countryData : ['خارج السعودية' , 'السعودية' ],
      provinceData: {'0':'اختر المنطقة'},
      citiesData : ['اختر المدينة', 'المدينة' , 'الرياض'],
      neighborhoodsData : ['اختر الحي' ,'الفتح' ,'الملز'],
      selectedType: '',
      selectedCountry : 'خارج السعودية',
      selectedProvince:'',
      selectedCity:'',
      title:'',
      ad_type:'',
      type:'',
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
      lat:'',
      lng:'',
      phone:'',
      email:'',
      location:{latitude: 24.713000 , longitude: 46.855451},
      region:{
        latitude:  24.713000 ,
        longitude: 46.855451 ,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    }
  }

  UNSAFE_componentWillMount() {
      const  params  = this.props.navigation.state.params;
      this.setState({entity_id : params.entity_id})
  }

  async componentDidMount(){

    this.get_entity_data()

    let user_id     = await AsyncStorage.getItem('user_id');
    let app_token   = await AsyncStorage.getItem('app_token');

    this.setState({user_id: user_id})

    this.getTypesData()
    // navigator.geolocation.requestAuthorization();
    // Instead of navigator.geolocation, just use Geolocation.
    this.requestLocationPermission();
    //this.getMyLocation();

  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'طلب الاذن',
          message:'تطبيق Aqar4D يتطلب الاذن للوصول إلى موقعك' ,
          buttonNeutral: 'لاحقا',
          buttonNegative: 'إلغاء',
          buttonPositive: 'موافق',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied' , granted);
      }
    } catch (err) {
      console.error(err);
    }
  }

  getMyLocation = async () => {

    const hasLocationPermission = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

    console.log('hasLocationPermission :' , hasLocationPermission);

    if (hasLocationPermission) {
        await Geolocation.getCurrentPosition(
            (position) => {

                console.log( "This is your location" , position );
                this.setState({
                   location: {
                     latitude: position.coords.latitude ,
                     longitude : position.coords.longitude
                   },
                   region: {
                    latitude: position.coords.latitude ,
                    longitude : position.coords.longitude ,
                    latitudeDelta: 0.0015 ,
                    longitudeDelta: 0.0012
                   }
                });
            },
            (error) => {
                // See error code charts below.
                console.log('error on get position');
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }else{
      this.requestLocationPermission();
      console.log( "ACCESS_FINE_LOCATION permission denied" )
    }

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
          updating:false,
          title: response.data.title,
          ad_type: response.data.ad_type,
          type: response.data.type_id,
          selectedType: response.data.type,
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

  getTypesData = async () =>{

    let our = this;
     // Call the back-end API
     let url = BASE_URL + 'get_real_eatate_type';
    await axios.post(url)
     .then(function (response) {
        our.setState({typeData: response.data})
     })
     .catch(function (error) {
       // handle error
       console.log(error);
     })
     .finally(function () {
       // always executed
     });

  }

  adTypeList = () => {
    return ( this.state.adTypeData.map( (value , key ) => {
        return (<Picker.Item label={value} key={key} value={value} /> )
      })
    )
  }

  typesList = () => {

     return( Object.keys(this.state.typeData).map( (key) => {
      return( <Picker.Item label={this.state.typeData[key]} key={key} value={this.state.typeData[key]}  />)} ));
  }

  _onSavePressed = (e) => {
    //e.preventDefault();

      console.log(this.state);

      //let phoneLength         = this.state.phone.length
      //let emailLength         = this.state.email.length

      let ad_typeLength       = this.state.ad_type.length
      let titleLength         = this.state.title.length
      let typeLength          = this.state.type.length
      let priceLength         = this.state.price.length
      let spaceLength         = this.state.space.length
      let countryLength       = this.state.country.length
      let provinceLength      = this.state.province.length
      let cityLength          = this.state.city.length
      let neighborhoodLength  = this.state.neighborhood.length
      let descriptionLength   = this.state.description.length
      let latitudeLength      = this.state.location.latitude.length
      let longitudeLength     = this.state.location.longitude.length

      if(ad_typeLength ==0 || titleLength == 0 || typeLength == 0 || priceLength == 0 || spaceLength == 0 || countryLength == 0 || provinceLength == 0 ||
         cityLength == 0 || neighborhoodLength == 0 || descriptionLength == 0 || latitudeLength == 0 || longitudeLength == 0  ){
           Vibration.vibrate(PATTERN );
           Alert.alert(
             'رسالة تنبيه',
             'الرجاء ملء جميع الحقول',
             [
               {text: 'موافق', onPress: () => console.log('OK Pressed')},
             ],
             {cancelable: true},
           );
      }else{
        const {entity_id , title,ad_type ,type,price,space,country,province,city,neighborhood,phone,email,description,location}  = this.state;
        this.send_edit_request_to_server({entity_id , title,ad_type ,type,price,space,country,province,city,neighborhood,phone,email,description,location});
        //this.props.addEntity({title,adType,type,price,country,province,city,neighborhood,phone,email,description, location , video , images});
      }


  }

  send_edit_request_to_server = async ({entity_id , title, ad_type ,type,price,space,country,province,city,neighborhood,phone,email,description,location}) => {

    let our = this;

    let form_data = new FormData();
    form_data.append('entity_id' , entity_id);
    //form_data.append('add_by' , user_id);
    form_data.append('title', title);
    form_data.append('type', type);
    form_data.append('ad_type', ad_type);
    form_data.append('price', price);
    form_data.append('space', space);
    form_data.append('country', country);
    form_data.append('province', province);
    form_data.append('city', city);
    form_data.append('neighborhood', neighborhood);
    form_data.append('phone', phone);
    form_data.append('email', email);
    form_data.append('description', description);
    form_data.append('lat', location.latitude);
    form_data.append('lng', location.longitude);

    let url = BASE_URL + "edit_entity";
    await axios.post(url,form_data)
     .then(function (response) {
        console.log( response )
        if(response.data.success){
          Vibration.vibrate( 100 );
          our.setState({
            updating:false,
          })
          our.props.navigation.replace( 'Details_page', { entity_id: our.state.entity_id } )
        }else{
          Vibration.vibrate( PATTERN );
          Alert.alert(
            'رسالة تنبيه',
            'حدث خطأ ما, الرجاء المحاولة لاحقاً',
            [
              {text: 'موافق', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
          );
        }
      })
     .catch(function (error){
        console.log( error)
        Vibration.vibrate( PATTERN );
        Alert.alert(
          'رسالة تنبيه',
          'حدث خطأ ما, الرجاء المحاولة لاحقاً',
          [
            {text: 'موافق', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true},
        );
      })
      .finally(function () {
        // always executed
        our.setState({
            updating:false,
        })
      });

  }

  _renderSaveButton = () => {
    if (this.state.updating) {
      return (
        <View style={styles.container}>
           <SmallSpinner />
        </View>
      )
    }
    return (<Button onPress={this._onSavePressed.bind(this)}  > تحديث </Button>);
  }

  renderView = () => {

    if(this.state.loading){
      return(
        <View style={styles.container}>
          <SmallSpinner />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollStyle}>
          <View style={styles.title}>
            <Text style={styles.titleText}> تعديل بيانات العقار </Text>
          </View>
          <Card>

            <CardItem>
              <Input
                label='العنوان'
                placeholder='اكتب عنوان لعقارك'
                secureTextEntry={false}
                value={this.state.title}
                onChangeText={(title) => this.setState({ title  }) }
              />
            </CardItem>

            <CardItem>
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >نوع الإعلان</Text>
              <Picker
                selectedValue={this.state.ad_type}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({ad_type: itemValue })
              }>
                { this.adTypeList() }
              </Picker>
            </CardItem>

            <CardItem>
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >نوع العقار</Text>
              <Picker
                selectedValue={this.state.selectedType}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({type: itemIndex , selectedType :itemValue  } )
              }>
                { this.typesList() }
              </Picker>
            </CardItem>

            <CardItem>
              <Input
                label='السعر'
                placeholder='اكتب سعر العقار'
                value={this.state.price}
                keyboardType={'numeric'}
                secureTextEntry={false}
                onChangeText={(price) => this.setState({ price  }) }
              />
            </CardItem>

            <CardItem>
              <Input
                label='المساحة'
                placeholder='اكتب مساحة العقار'
                value={this.state.space}
                keyboardType={'numeric'}
                secureTextEntry={false}
                onChangeText={(space) => this.setState({ space  }) }
              />
            </CardItem>

            <CardItem>
              <Input
                label='الدولة'
                placeholder='الدولة'
                secureTextEntry={false}
                value={this.state.country}
                onChangeText={(country) => this.setState({ country  }) }
              />
            </CardItem>

            <CardItem>
              <Input
                label='المنطقة'
                placeholder='المنطقة'
                secureTextEntry={false}
                value={this.state.province}
                onChangeText={(province) => this.setState({ province  }) }
              />
            </CardItem>

            <CardItem>
              <Input
                label='المدينة'
                placeholder='المدينة'
                secureTextEntry={false}
                value={this.state.city}
                onChangeText={(city) => this.setState({ city  }) }
              />
            </CardItem>

            <CardItem>
              <Input
                label='الحي'
                placeholder='الحي'
                secureTextEntry={false}
                value={this.state.neighborhood}
                onChangeText={(neighborhood) => this.setState({ neighborhood  }) }
              />
            </CardItem>

            <View style={styles.map}>
               <Button onPress={this.getMyLocation} >حدد موقعي</Button>
               <Text style={styles.redText} >اذا كان العقار في مكان غير موقع تواجدك</Text>
               <Text style={styles.redText} >حدده عن طريق الضغط عليه حتى يتحرك السهم الاحمر</Text>
               <MapView
                 provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                 style={styles.map}
                 region={this.state.region}
                 zoomControlEnabled={false}
                 minZoomLevel={8}
                 maxZoomLevel={20}
                 mapType={"hybrid"}
                 onPress={(e) => this.setState({
                    location: e.nativeEvent.coordinate,
                    region: {
                     latitude: e.nativeEvent.coordinate.latitude ,
                     longitude : e.nativeEvent.coordinate.longitude ,
                     latitudeDelta: 0.0015 ,
                     longitudeDelta: 0.0012
                    }
                   }) }
               >
                  <Marker
                    draggable
                    coordinate={this.state.location}
                    title={'موقع العقار على الخريطة'}
                    onDragEnd={(e) =>
                      this.setState({
                        // region: {
                        //  latitude: e.nativeEvent.coordinate.latitude ,
                        //  longitude : e.nativeEvent.coordinate.longitude ,
                        //  latitudeDelta: 0.0015 ,
                        //  longitudeDelta: 0.0012
                        // },
                        location: e.nativeEvent.coordinate
                      })

                    }
                  />

               </MapView>


             </View>

             <CardItem>
               <Input
                 label= 'اكتب وصف وتفاصيل أخرى'
                 placeholder= 'اكتب وصف وتفاصيل أخرى'
                 multiline={true}
                 value={this.state.description}
                 secureTextEntry={false}
                 onChangeText={(description) => this.setState({ description  }) }
               />
             </CardItem>

             <View style={styles.saveBTN}>
                 {this._renderSaveButton()}
             </View>

          </Card>
        </ScrollView>
      </View>
    );
  }

  render(){
    return(
      this.renderView()
    )
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor:'#FFFFFF',
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
    flex:1,
    marginTop:50,
    marginBottom:60,
  },
  imgBox:{
    marginTop:20,
    marginBottom:20,
  },
  image:{
    marginLeft:10,
    marginRight:10,
  },
  imgSlider:{
    height:180,
  },
  videoContainer:{
    height:320,
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo:{
    // height:250,
    width:'100%',
    // alignItems: 'center',
    // marginTop:20,
    // marginBottom:20,
    // backgroundColor:'#ffffff',
    height:300,
    marginRight:10,
    marginLeft:10,
    marginTop:20,
    marginBottom:20,

  },
  redText:{
    color:'red',
  },
});

export default connect(null , { loginUser })(Edit_enetity);
