import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';

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

    <View style={{ margin: 4, borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />
  </View>
);

export default LabelSelector;