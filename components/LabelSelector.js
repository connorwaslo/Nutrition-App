import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RadioButton from './RadioButton';

const LabelSelector = (props) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <RadioButton selected={props.selected} />
        <Text style={{ margin: 5 }}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default LabelSelector;