import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';
import Hr from "./Hr";

const LabelSelector = (props) => (
  <View style={{ flex: 1 }}>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <TouchableOpacity style={{ width: '100%' }} onPress={props.onPress}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <RadioButton selected={props.selected} />
          <Text style={{ margin: 5 }}>{props.label}</Text>
        </View>
      </TouchableOpacity>
    </View>

    <Hr/>
  </View>
);

export default LabelSelector;