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
  Picker,
  TouchableOpacity,
  TouchableHighlight,
  PermissionsAndroid,
  Alert,
  Vibration
} from 'react-native';

import {BASE_URL}  from './base_url';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import MapView,  { PROVIDER_GOOGLE , Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Video from 'react-native-video';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import { addEntity  } from '../actions';
import { connect } from 'react-redux';
import { Button , Spinner , SmallSpinner , Input , Card , CardItem } from '../components';

const DURATION = 200;
const PATTERN = [200, 200, 200 , 200];

class Add_entity extends Component{

  constructor(){
    super();

    this.state = {
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
      provinceLoaded:false,
      title: '',
      adType: '',
      type:'',
      price:'',
      space:'',
      country:'',
      province:'',
      city:'',
      neighborhood:'',
      phone:'',
      email:'',
      description:'',
      images:[],
      video: null,
      location:{latitude: 24.713000 , longitude: 46.855451},
      region:{
        latitude:  24.713000 ,
        longitude: 46.855451 ,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    }
  }

  componentWillUnmount(){
    console.log("This screen will removed ......")
  }

  UNSAFE_componentWillReceiveProps(props){
    if(!props.loading){
      if(props.error == true){
        console.log("we get props" , props);

        Vibration.vibrate(DURATION);

        this.setState({
          selectedProvince:'',
          selectedCity:'',
          provinceLoaded:false,
          title: '',
          adType: '',
          type:'',
          price:'',
          space:'',
          country:'',
          province:'',
          city:'',
          neighborhood:'',
          phone:'',
          email:'',
          description:'',
          images:[],
          video: null,
        })
        Alert.alert(
          'نجاح!!',
          'شكراً لك لقد تم إضافة عقارك بنجاح',
          [
            {text: 'موافق', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );

      }else{

        Vibration.vibrate(PATTERN);
        console.log("we get props" , props);
        Alert.alert(
          'خطأ!',
          'عفواً لقد حدث خطأ ما في إضافة طلبك ,الرجاء المحاولة لاحقاُ',
          [
            {text: 'موافق', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );

      }
    }

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

  async componentDidMount(){

    AsyncStorage.getItem('logged_in')
    .then(token => {
        if (token != 'yes'){
          this.props.navigation.navigate('Register');
        }else{

          this.getTypesData()
          // navigator.geolocation.requestAuthorization();
          // Instead of navigator.geolocation, just use Geolocation.
          if(Platform.OS === 'ios'){

          }else{
            this.requestLocationPermission();
          }

          this.getMyLocation();

        }
    });

  }

  getMyLocation = async () => {

    if(Platform.OS === 'ios'){
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
          { enableHighAccuracy: true, timeout: 11000, maximumAge: 2000 }
      );

    }else{

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
              { enableHighAccuracy: true, timeout: 11000, maximumAge: 2000 }
          );
      }else{
        this.requestLocationPermission();
        console.log( "ACCESS_FINE_LOCATION permission denied" )
      }
    }


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

  // Our country list generator for picker
  countryList = () =>{
      return( this.state.countryData.map( (x,i) => {
            return( <Picker.Item label={x} key={i} value={x}  />)
            } ));
  }

  // Our country list generator for picker
  provinceList = () =>{
    // return( this.state.provinceData.map( (x,i) => {
    //   return( <Picker.Item label={x} key={i} value={x}  />)} ));

    return( Object.keys(this.state.provinceData).map( (key) => {
      return( <Picker.Item label={this.state.provinceData[key]} key={key} value={key}  />)} ));

  }

  // Our cities list generator for picker
  cityList = () =>{
    // return( this.state.citiesData.map( (x,i) => {
    //   return( <Picker.Item label={x} key={i} value={x}  />)} ));

    console.log("cities list");
    console.log(this.state.citiesData);

    return( Object.keys(this.state.citiesData).map( (key , value) => {
      return( <Picker.Item label={this.state.citiesData[key]} key={key} value={key}  />)} ));
  }

  // Our neighborhoods list generator for picker
  neighborhoodList = () =>{
      return( this.state.neighborhoodsData.map( (x,i) => {
            return( <Picker.Item label={x} key={i} value={x}  />)} ));
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

  getprovinceData = async () => {
    // Make a request for a user with a given ID
    let our = this;// this to fix axios unable to access ( this) see:-
   // https://stackoverflow.com/questions/49692149/how-can-i-set-state-of-res-from-axios-in-reactnative
   let url = BASE_URL + 'get_provinces';
   await axios.get(url)
      .then(function (response) {
        // handle success
        our.setState({provinceData: response.data , provinceLoaded: true})
        //console.log(response.data);
        //console.log(our.state.provinceData);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed

      });
  }

  getCitiesData = async ( itemValue , itemIndex) =>{

    this.setState({ selectedProvince: itemValue , province: this.state.provinceData[itemValue] })
    console.log('this is your ID '  + itemIndex + " value : " + itemValue )

    let our = this;
    const params = new URLSearchParams();
    params.append('provinceid', itemValue);

     // Call the back-end API
     let url = BASE_URL + 'get_citis';
    await axios.post( url , params)
     .then(function (response) {
        our.setState({citiesData: response.data})
        //console.log(response.data);
     })
     .catch(function (error) {
       // handle error
       console.log(error);
     })
     .finally(function () {
       // always executed
     });

  }

  getNeighborhoodsData = async ( itemValue , itemIndex) =>{

    this.setState({ selectedCity : itemValue , city: this.state.citiesData[itemValue]  })
    console.log('this is your ID '  +itemIndex+ " value : " + itemValue )

    let our = this;
    const params = new URLSearchParams();
    params.append('cityid', itemValue);

     // Call the back-end API
     let url = BASE_URL + 'get_neighborhoods'
    await axios.post( url , params)
     .then(function (response) {
        our.setState({neighborhoodsData: response.data})
        //console.log(response.data);
     })
     .catch(function (error) {
       // handle error
       console.log(error);
     })
     .finally(function () {
       // always executed
     });

  }

  _renderImages(){
    return(
       this.state.images.map( (value , key) => {
          //console.log('image key : ' + key)
          let Image_URI = { uri: value.path};
          console.log('image path : ' , Image_URI)
          return(
            <TouchableOpacity key={key} onPress={(key) => this.remove_image(key)}>
              <Image source={Image_URI} style={[styles.image , { width: 120 , height:180,  }]}/>
            </TouchableOpacity>
          )
      })
    );
  }

  _renderVideo(){
    if(this.state.video != null){
      console.log("video path : " + this.state.video.path)
      return(
          <Video source={{uri: this.state.video.path}}   // Can be a URL or a localfile.
            ref={(ref) => {
              this.player = ref
            }}                                      // Store reference
            onBuffer={this.onBuffer}                // Callback when remote video is buffering
            onEnd={this.onEnd}                      // Callback when playback finishes
            onError={this.videoError}               // Callback when video cannot be loaded
            style={styles.backgroundVideo}
            controls={false} />
      );
    }
  }

  _renderAddress(){
    if(this.state.selectedCountry === 'خارج السعودية'){
      return(
        <View>

          <CardItem>
            <Input
              label='الدولة'
              placeholder='الدولة'
              secureTextEntry={false}
              onChangeText={(country) => this.setState({ country  }) }
            />
          </CardItem>

          <CardItem>
            <Input
              label='المنطقة'
              placeholder='المنطقة'
              secureTextEntry={false}
              onChangeText={(province) => this.setState({ province  }) }
            />
          </CardItem>

          <CardItem>
            <Input
              label='المدينة'
              placeholder='المدينة'
              secureTextEntry={false}
              onChangeText={(city) => this.setState({ city  }) }
            />
          </CardItem>

          <CardItem>
            <Input
              label='الحي'
              placeholder='الحي'
              secureTextEntry={false}
              onChangeText={(neighborhood) => this.setState({ neighborhood  }) }
            />
          </CardItem>

        </View>
      );
    }else{
      //this.setState({country: 'السعودية'})
      if(this.state.provinceLoaded == false){
        this.getprovinceData();
      }

      return(
        <View>
          <CardItem>
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >المنطقة</Text>
              <Picker
                selectedValue={ this.state.selectedProvince }
                style={{height: 50, width:'75%'}}
                onValueChange={ (itemValue, itemIndex) => this.setState({ selectedProvince: itemValue  }) , (itemValue, itemIndex) => this.getCitiesData( itemValue , itemIndex)  }
              >
                { this.provinceList() }

              </Picker>
          </CardItem>

          <CardItem>
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >المدينة</Text>
              <Picker
                selectedValue={this.state.selectedCity}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({selectedCity: itemValue  }) , (itemValue, itemIndex) => this.getNeighborhoodsData(itemValue , itemIndex) }
              >
                { this.cityList() }
              </Picker>
          </CardItem>

          <CardItem>
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >الحي</Text>
              <Picker
                selectedValue={this.state.neighborhood}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({neighborhood: itemValue  })}
              >
                { this.neighborhoodList() }
              </Picker>
          </CardItem>


        </View>
      );
    }
  }

  remove_image(index){
    console.log('Image key removed: ' + index)
    var array = [...this.state.images]; // make a separate copy of the array

    if (index !== -1) {
      array.splice(index, 1);
      this.setState({images: array});
    }

  }

  _onImageSelectPressed = async () => {

    const options = {
      mediaType:'photo',
      noData:true,
    };

    // ImagePicker.launchImageLibrary(options, (response) => {
    //   console.log('Response = ', response);
    //
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //   } else {
    //     // const source = { uri: response.uri };
    //     // You can also display the image using data:
    //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    //     var newImgs = this.state.images.concat(response);
    //     this.setState({images: newImgs})
    //   }
    // });

    ImagePicker.openPicker({
      multiple: true,
      mediaType:'photo',
    }).then(images => {
      var newImgs = this.state.images.concat(images);
      this.setState({images: newImgs})
      //console.log('hello wolrd');
      //console.log(this.state.images);
    }).catch(e => {
      //alert(e);
      console.log(e);
    });

    // ImagePicker.clean().then(() => {
    //   console.log('removed all tmp images from tmp directory');
    // }).catch(e => {
    //   console.log(e);
    // });

  }

  _onVideoSelectPressed = async () => {
    // const { email, password } = this.state;
    // this.props.loginUser({ email, password });

    ImagePicker.openPicker({
      multiple: false,
      mediaType:'video',
    }).then(video => {
      //var newImgs = this.state.images.concat(images);
      this.setState({video: video})
      //console.log(video);
      //console.log(this.state.images);
    }).catch(e => {
      console.log(e);
    });

    // ImagePicker.clean().then(() => {
    //   console.log('removed all tmp images from tmp directory');
    // }).catch(e => {
    //   alert(e);
    // });

  }

  _onSavePressed = (e) => {
    //e.preventDefault();

      let phoneLength         = this.state.phone.length
      let emailLength         = this.state.email.length

      let adTypeLength        = this.state.adType.length
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

      if(adTypeLength ==0 || titleLength == 0 || typeLength == 0 || priceLength == 0 || spaceLength == 0 || countryLength == 0 || provinceLength == 0 ||
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
        const {title,adType,type,price,space,country,province,city,neighborhood,phone,email,description,location , video , images}  = this.state;
        this.props.addEntity({title,adType,type,price,space,country,province,city,neighborhood,phone,email,description, location , video , images});
      }


  }

  _renderSaveButton = () => {
    if (this.props.loading) {
      return (
        <View style={styles.container}>
           <SmallSpinner />
        </View>
      )
    }
    return (<Button onPress={this._onSavePressed.bind(this)} >اضافة</Button>);
  }

  _renderView = () => {

    return(
      <View style={styles.container}>
        <Card>
          <ScrollView style={styles.scrollStyle}>
            <View style={styles.title}>
              <Text style={styles.titleText}>أضف بيانات عقارك</Text>
            </View>
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
                selectedValue={this.state.adType}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({adType: itemValue })
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
              <Text   style={{fontSize: 16, paddingLeft: 20, alignItems:'center' }} >الدولة</Text>
              <Picker
                selectedValue={this.state.selectedCountry}
                style={{height: 50, width:'75%'}}
                onValueChange={(itemValue, itemIndex) => this.setState({selectedCountry: itemValue , country : itemValue })
              }>
                { this.countryList() }
              </Picker>
            </CardItem>

            {this._renderAddress()}


            <View style={styles.selectImgBtn}>
              <Button onPress={this._onImageSelectPressed.bind(this)} >اختر صورة</Button>
            </View>


            <View style={styles.imgBox}>
              <ScrollView
                style={styles.imgSlider}
                horizontal={true}
              >
                {this._renderImages()}

              </ScrollView>
            </View>

            <View style={styles.selectImgBtn}>
              <Button onPress={this._onVideoSelectPressed.bind(this)} >اختر فديو</Button>
            </View>

            <View style={styles.videoContainer}>
              {this._renderVideo()}
            </View>

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

          </ScrollView>
        </Card>
      </View>
    );

  }

  render(){
    return(
      this._renderView()
    )
  }

}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop:10,
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


const mapStateToProps = state => {
  return {
    error: state.addEntityReducer.error,
    loading: state.addEntityReducer.loading,
    data: state.addEntityReducer.data
  }
}


export default connect(mapStateToProps , { addEntity })(Add_entity);
