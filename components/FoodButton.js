import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Hr from "./Hr";

class FoodButton extends Component {
  render() {
    return (
      <View style={{ height: '20%' }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',
            padding: 15, width: '100%' }} onPress={() => {}}>
            <View style={{ textAlign: 'left', left: 0 }}>
              <Text>{this.props.food}</Text>
            </View>
            <View style={{ flexDirection: 'row', textAlign: 'right', right: 0 }}>
              <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.props.change(this.props.index, 1)}>
                <Text>(+)</Text>
              </TouchableOpacity>
              <TextInput
                onChangeText={text => this.props.updateQuant(this.props.index, text)}
                value={this.props.quantity}/>
              <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.props.change(this.props.index, -1)}>
                <Text>(-)</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'left', paddingHorizontal: 10 }}>{this.props.description}</Text>

        <Hr/>
      </View>
    )
  }
}

export default FoodButton;