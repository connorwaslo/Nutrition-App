import React, { Component } from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import LabelSelector from "./LabelSelector";
import RadioButton from "./RadioButton";

const AddLabel = (props) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Text style={{ margin: 5 }}>(+) Add Label</Text>
      </View>
    </TouchableOpacity>
  </View>
);

class SelectLabels extends Component {
  constructor(props) {
    super(props);

    let selections = [];
    for (let i = 0; i < props.labels.length; i++) {
      selections.push(false);
    }

    this.state = {
      labels: props.labels,
      selections: selections,
      typingLabel: false,
      newLabel: ''
    }
  }

  render() {
    const {selections, labels, typingLabel} = this.state;

    console.log(selections);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'rgba(1, 1, 1, 0.4)' }}>
        {labels.map((label, i) => (
          <LabelSelector key={i}
                         selected={selections[i]}
                         label={label}
                         onPress={() => this._onPress(i)}/>
        ))}

        {typingLabel ? <TextInput
          onChange={e => this.setState({ newLabel: e })}
          onEndEditing={this._submitNewLabel.bind(this)}/>
          : null}

        <AddLabel onPress={this._addLabel.bind(this)}/>
      </ScrollView>
    )
  }

  _onPress = (i) => {
    let temp = this.state.selections;
    temp[i] = !temp[i];

    console.log('Pressed', i);
    this.setState({ selections: temp });
  };

  _addLabel = () => {
    this.setState({
      typingLabel: true
    })
  }

  _submitNewLabel = () => {
    let tempSel = this.state.selections;
    tempSel.push(false);

    let tempLabels = this.state.labels;
    tempLabels.push(this.state.newLabel);

    this.setState({
      selections: tempSel,
      labels: tempLabels,
      typingLabel: false,
      newLabel: ''
    })
  }
}

export default SelectLabels;