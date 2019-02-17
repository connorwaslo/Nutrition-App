import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Hr from "./Hr";

class FoodButton extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginVertical: 5 }}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <View style={{ textAlign: 'left', left: 10 }}>
            <Text>{this.props.food}</Text>
          </View>
          <View style={{ flexDirection: 'row', textAlign: 'right', right: 10 }}>
            <TouchableOpacity style={{paddingRight: 10}} onPress={() => this.props.change(this.props.index, 1)}>
              <Text>(+)</Text>
            </TouchableOpacity>
            <TextInput
              onChangeText={text => this.props.updateQuant(this.props.index, text)}
              value={this.props.quantity}/>
            <TouchableOpacity style={{paddingLeft: 10}} onPress={() => this.props.change(this.props.index, -1)}>
              <Text>(-)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ textAlign: 'left', paddingHorizontal: 10 }}>{this.props.description}</Text>

        <Hr/>
      </View>
    )
  }
}

export default FoodButton;