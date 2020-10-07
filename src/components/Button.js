import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
      height: 40,
      borderRadius: 5,
      // marginHorizontal: 25,
      marginVertical: 10,
      backgroundColor: '#f8eb28',
      justifyContent: 'center',
      // flex: 1
    },
    buttonText: {
      color: '#666666',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
    }
});

const Button = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>
        { props.children }
      </Text>
    </TouchableOpacity>
  );
}

export { Button };
