import React from 'react';
import { View, StyleSheet } from 'react-native';

const RadioButton = (props) => (
  <View style={[
    styles.border, props.style
  ]}>
    {props.selected ?
      <View style={styles.center} /> : null
    }
  </View>
);

const styles = StyleSheet.create({
  border: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#4286f4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4286f4'
  }
});

export default RadioButton;