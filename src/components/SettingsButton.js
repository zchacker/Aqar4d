import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
      height: 35,
      borderRadius: 5,
      marginHorizontal: 25,
      marginVertical: 0,
      backgroundColor: '#B89F03',
      justifyContent: 'center',
      flex: 1
    },
    buttonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
    }
});

const SettingsButton = (props) => {
  return (
    <TouchableOpacity style={[ styles.button , {backgroundColor: props.color} ]} onPress={props.onPress}>
      <Text style={styles.buttonText}>
        { props.children }
      </Text>
    </TouchableOpacity>
  );
}

export { SettingsButton };
