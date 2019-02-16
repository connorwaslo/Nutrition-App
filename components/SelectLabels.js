import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import LabelSelector from "./LabelSelector";

class SelectLabels extends Component {
  constructor(props) {
    super(props);

    let selections = [];
    for (let i = 0; i < props.labels.length; i++) {
      selections.push(false);
    }

    this.state = {
      labels: props.labels,
      selections: selections
    }
  }

  render() {
    const {selections, labels} = this.state;

    console.log(selections);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'rgba(1, 1, 1, 0.4)' }}>
        {labels.map((label, i) => (
          <LabelSelector key={i}
                         selected={selections[i]}
                         label={label}
                         onPress={() => this._onPress(i)}/>
        ))}
      </ScrollView>
    )
  }

  _onPress = (i) => {
    let temp = this.state.selections;
    temp[i] = !temp[i];

    console.log('Pressed', i);
    this.setState({ selections: temp });
  }
}

export default SelectLabels;