import React from 'react';
import { View, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  cardItem: {
    marginTop:15,
    padding: 5,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  }
});

const CardItem = (props) => {
  return(
    <View style={styles.cardItem}>
      { props.children }
    </View>
  );
};


export { CardItem };
