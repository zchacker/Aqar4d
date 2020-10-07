/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {BASE_URL , UPLOAD_URL}  from './base_url';
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
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Vibration,
  Linking,
  Platform
} from 'react-native';

import { homeData , search_entities } from '../actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button , Spinner , SmallSpinner } from '../components';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import FastImage from 'react-native-fast-image'

import AsyncStorage from '@react-native-community/async-storage';


const DURATION = 100;

class Search extends Component{

  constructor(){
    super();
    this.state = {
      entitis: [],
      page: 1,
      refreshing: false,
      filterLoading: false,
      typeData:[],
      seletedType:'الكل',
      count: 10,
      keyword:'',
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log('we get entities data' , nextProps)
    if(nextProps.entities){
      console.log('we get entities data' , nextProps)
      this.setState({
        entitis : nextProps.entities.entities ,
        keyword: nextProps.entities.keyword,
        refreshing: false ,
      })

    }
  }

  refreshHandelr = () => {

    console.log('we refresh ');
    Vibration.vibrate(DURATION) ;
    this.setState({
      page: 1,
      refreshing: true
    },() => {

      //Call the back-end API
     //Please do not spam/abuse it so others can use it as well.
     var url;

     // if(this.state.seletedType === 'الكل'){
     //     url = BASE_URL+'search/'+this.state.page;
     //     console.log(url);
     //
     //     axios.get(url)
     //       .then(resp => this.requestNewData(resp) )
     //       .catch(error => console.error( error));
     //
     //
     // }else{

         url = BASE_URL+'search/'+this.state.page;
         console.log(url);
         let form_data = new FormData();
         form_data.append('keyword' , this.state.keyword);

         axios.post(url , form_data)
           .then(resp => this.requestNewData(resp) )
           .catch(error => console.error( error));

     // }

   });

  }

  loadMore = () => {
    console.log('we load more ');

    this.setState({
      page:  this.state.page + 1,
    },() => {

      //Call the back-end API
     //Please do not spam/abuse it so others can use it as well.
     var url = '';
     // if(this.state.seletedType === 'الكل'){ // send GET request
     //
     //   url = BASE_URL+'get_all_entites/'+this.state.page;
     //   axios.get(url)
     //     .then(response => this.responseLoadMore(response) )
     //     .catch(error => console.error( error));
     //
     // }else{ // send POST request

       url = BASE_URL+'search/'+this.state.page;
       let form_data = new FormData();
       form_data.append('keyword' , this.state.keyword);

       axios.post(url , form_data)
         .then(response => this.responseLoadMore(response) )
         .catch(error => console.error( error));

     // }


    })
  }

  responseLoadMore = (response) => {
    //console.log('entitis load more one : ' , this.state.entitis)
    if(response.data.success){
      if(response.data.entities.length > 0){
        this.setState({
          entitis :  this.state.entitis.concat(response.data.entities)
        })
        //console.log('entitis load more two : ' , this.state.entitis)
      }
    }
  }

  requestNewData = (resp) => {
    this.setState({
      refreshing: false,
      entitis : resp.data.entities,
      page: 1
    })
    console.log("get data for entity :" , resp.data.entities);
    Vibration.cancel();
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

  render(){

    if (this.props.loading) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
        );
    }

    return(
      <View style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <View style={styles.flatListWrap}>
          <FlatList
            style={styles.flatList}
            data={this.state.entitis}
            renderItem={this.entity_render}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
            onRefresh={this.refreshHandelr}
            refreshing={this.state.refreshing}
            onEndReached={this.loadMore}
            onEndReachedThreshold={1}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FBFBFA',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  filterWrap:{
    flex: 1,
    height:40,
    backgroundColor:'#FFFFFF',
  },
  flatListWrap:{
    flex: 10,
    backgroundColor: '#FBFBFA',
    //backgroundColor: '#FBFBFA',
  },
  flatList:{
    flex: 1,
  },
  filterButton:{
    justifyContent: 'center',
    marginLeft:5,
    marginRight:5,
    marginTop:5,
    marginBottom:5,
    padding:3,
    paddingLeft:8,
    paddingRight:8,
    paddingLeft:10,
    paddingRight:10,
    borderRadius:8,
    borderColor:'#A98F38',
    borderWidth:1,
    height:35,
  },
  filterButtonActive:{
    backgroundColor:'#A98F38',
  },
  filterButtonText:{
    textAlign: 'center',
    fontWeight: '500',
  },
  spinnerContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollStyle:{
    // flex: 1,
    // paddingLeft:18,
    // paddingRight:18,
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
    borderWidth: 1,
    borderRadius:5,
    borderColor: '#333333',// #BEBEBE
  },
  adInfo:{
    flex:3,
  },
  adTitle:{
    fontSize:15,
    fontWeight:'bold',
    minHeight:5,
  },
  adDate:{
    color:'#737372',
    marginBottom:10,
  },
  adPrice:{
    color:'#B82403',
  },
  adSpace:{
    color:'#BB780F',
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
  adImg:{
    borderRadius:7,
    width:140,
    height:140,
    backgroundColor:'#F3EDCE',
    marginLeft:2,
    marginRight:5,
  },
  spinnerContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
  },
});

const mapStateToProps = state => {
  return {
    error: state.searchReducer.error,
    loading: state.searchReducer.loading,
    entities: state.searchReducer.entities,
  }
}

export default connect(mapStateToProps , { search_entities })(Search);
