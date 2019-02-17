import React, { Component } from 'react';
import {ScrollView, Text, TextInput, TouchableOpacity, View, Keyboard} from 'react-native';
import {Button} from 'native-base';
import LabelSelector from "./LabelSelector";


const AddLabel = (props) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <TouchableOpacity style={{ width: '100%' }} onPress={props.onPress}>
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
      newLabel: '',
      showSubmit: true
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ showSubmit: false });
  };

  _keyboardDidHide = () => {
    this.setState({ showSubmit: true });
  };

  _renderSubmit = () => (
    <View style={{ width: '100%' }}>
      <Button block primary onPress={this._submitFood.bind(this)}>
        <Text style={{ color: 'white' }}>Submit</Text>
      </Button>
    </View>
  );

  render() {
    const {selections, labels, typingLabel, showSubmit} = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(1, 1, 1, 0.4)' }}>
        <ScrollView style={{ flex: 1 }}>
          {labels.map((label, i) => (
            <LabelSelector key={i}
                           selected={selections[i]}
                           label={label}
                           onPress={() => this._onPress(i)}/>
          ))}

          {typingLabel ? <TextInput
              autoFocus={true}
              onChangeText={text => this.setState({newLabel: text})}
              onSubmitEditing={this._submitNewLabel.bind(this)}/>
            : null}

          <AddLabel onPress={this._addLabel.bind(this)}/>
        </ScrollView>

        {showSubmit ? this._renderSubmit() : null}
      </View>
    )
  }

  _onPress = (i) => {
    let temp = this.state.selections;
    temp[i] = !temp[i];

    this.setState({ selections: temp });
  };

  _addLabel = () => {
    this.setState({
      typingLabel: true
    })
  };

  _submitNewLabel = () => {
    let tempSel = this.state.selections;
    tempSel.push(true);

    let tempLabels = this.state.labels;
    tempLabels.push(this.state.newLabel);

    this.setState({
      selections: tempSel,
      labels: tempLabels,
      typingLabel: false,
      newLabel: ''
    });
  }

  // Submit food to next screen to be analyzed fatsecret API
  _submitFood = () => {
    const {selections, labels} = this.state;

    this.props.submit(selections, labels);
  };
}

export default SelectLabels;