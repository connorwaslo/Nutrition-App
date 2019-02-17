import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Hr from "./Hr";

const FoodButton = (props) => (
  <View style={{ height: '10%' }}>
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',
        padding: 15, width: '100%' }} onPress={() => {}}>
        <View style={{ textAlign: 'left', left: 0 }}>
          <Text>{props.food}</Text>
        </View>
        <View style={{ flexDirection: 'row', textAlign: 'right', right: 0 }}>
          <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => props.change(props.index, 1)}>
            <Text>+</Text>
          </TouchableOpacity>
          <Text>{props.quantity}</Text>
          <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => props.change(props.index, -1)}>
            <Text>-</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>

    <Hr/>
  </View>
);

export default FoodButton;