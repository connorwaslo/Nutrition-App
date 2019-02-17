import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Container} from 'native-base'
import FoodButton from '../components/FoodButton';

class NutritionScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    let food = props.navigation.getParam('food', []);
    let quant = [];
    for (let i = 0; i < food.length; i++) {
      quant.push(1);
    }

    this.state = {
      foodList: food,
      quantity: quant
    }
  }

  _checkForFood = () => {
    const {foodList} = this.state;
    if (foodList.length === 0) {
      return (
        <Text style={{ textAlign: 'center', top: '300' }}>No food yet. Go back and add some!</Text>
      )
    }

    return null;
  };

  _renderFoodButtons = () => {
    const {foodList, quantity} = this.state;

    return foodList.map((food, i) => (
      <FoodButton key={i} index={i} food={food} quantity={quantity[i]} change={this._changeQuantity.bind(this)}/>
    ));
  };

  render() {
    return (
        <View style={{ flex: 1, marginTop: '5%' }}>
          {this._checkForFood()}

          {this._renderFoodButtons()}
        </View>
    )
  }

  _changeQuantity = (index, change) => {
    let temp = this.state.quantity;

    if (temp[index] + change >= 0) {
      temp[index] += change;

      this.setState({ quantity: temp });
    }
  }
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    alignItems: 'center',
    top: 100
  }
});

export default NutritionScreen;