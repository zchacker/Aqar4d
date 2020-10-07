// LogoutButton

import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  TextInput,
  Alert
} from 'react-native';
import { search_entities } from '../actions';

import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

class SearchBar extends Component{

  constructor(){
    super();
    this.state = {
      keyword:'',
      placeholder:'اكتب كلمة بحث...',
    }
  }

  onSubmit(keyword){
      this.props.search_entities(keyword)
  }

  render(){
    return(
      <View style={styles.buttonWrap}>

        <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => this.setState({keyword: text})}
            value={this.state.keyword}
            placeholder={this.state.placeholder}
            returnKeyType='search'
            onSubmitEditing={() => this.onSubmit(this.state.keyword) }
          />

      </View>
    );
  }

}


const styles = StyleSheet.create({
  buttonWrap:{
    // flexDirection:'row',
    // justifyContent:'space-between',
    justifyContent: 'center',
    flex:1,
    width:270,
    alignSelf: 'stretch',
    marginRight: 7,
  },
  offButton:{
    margin:5,
    marginRight:5,
    marginLeft:5,
  },
  inputStyle:{
    // justifyContent: 'center',
    height: 35,
    borderColor: '#D3AD10',
    borderWidth: 1 ,
    width:'98%' ,
    borderRadius:5,
    marginRight:5,
    marginLeft:5,
  }
});

const mapStateToProps = state => {
  return {
    error: state.SearchReducer.error,
    loading: state.searchReducer.loading,
    data: state.searchReducer.data,
  }
}

//export default connect(null)(withNavigation(SearchBar));
export default connect(null , { search_entities })(SearchBar);
