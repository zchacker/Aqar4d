import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    // flexDirection: 'row',
    // alignItems : 'center',
    minHeight: 80
  },
  label: {
    fontSize: 16,
    paddingLeft: 20,
    // flex: 1
  },
  input: {
    fontSize: 16,
    textAlign: "right",
    height: 45,
    color: '#000000',
    marginTop: 5,
    paddingHorizontal:20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 6,
    borderColor: '#B49630',// '#79AAF0',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    // flex: 3
  },
  multiInput: {
    // fontSize: 16,
    textAlign: "right",
    height: 150,
    color: '#000000',
    marginTop: 5,
    paddingHorizontal:20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    borderColor:'#B49630', //'#79AAF0',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    // flex: 3
  }

});

const Input = (props) => {
  if(props.multiline){
    return (
      <View style={styles.inputContainer}>

        <Text style={styles.label}>{props.label}</Text>

        <TextInput
          returnKeyType={'next'}
          placeholder={props.placeholder}
          secureTextEntry={props.secureTextEntry}
          autoCorrect={false}
          autoCapitalize='none'
          returnKeyType='none'
          keyboardType={props.keyboardType}
          multiline={props.multiline}
          onChangeText={props.onChangeText}
          value={props.value}
          style={styles.multiInput} />

      </View>
    );
  }else{
    return (
      <View style={styles.inputContainer}>

        <Text style={styles.label}>{props.label}</Text>

        <TextInput
          returnKeyType={'done'}
          placeholder={props.placeholder}
          secureTextEntry={props.secureTextEntry}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType={props.keyboardType}
          multiline={props.multiline}
          onChangeText={props.onChangeText}
          value={props.value}
          style={styles.input} />

      </View>
    );
  }

};


export { Input }
