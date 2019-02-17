import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {searchFood} from "../api/fatsecret";
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
      quant.push('1');
    }

    this.state = {
      foodList: food,
      quantity: quant,
      descriptions: [],
      isLoading: true
    }
  }

  async componentDidMount() {
    const {foodList} = this.state;
    let tempDescr = [];

    for (let i = 0; i < foodList.length; i++) {
      await searchFood(foodList[i]).then((result) => {
        tempDescr.push(result['foods']['food'][0]['food_description']);

        if (i === foodList.length - 1) {
          this.setState({
            descriptions: tempDescr,
            isLoading: false
          });
        }
      }).catch((err) => {
        console.log("Can't find that food...", err);
      });
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
    const {foodList, quantity, descriptions} = this.state;

    console.log(descriptions[0]);
    return foodList.map((food, i) => (
      <FoodButton key={i}
                  index={i}
                  food={food}
                  quantity={quantity[i]}
                  description={descriptions[i]}
                  updateQuant={this._updateQuant.bind(this)}
                  change={this._changeQuantity.bind(this)}/>
    ));
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        </View>
      )
    }

    return (
        <View style={{ flex: 1, marginTop: '5%' }}>
          {this._checkForFood()}

          {this._renderFoodButtons()}
        </View>
    )
  }

  _updateQuant = (index, text) => {
    let temp = this.state.quantity;

    temp[index] = text;

    this.setState({quantity: temp});
  };

  _changeQuantity = (index, change) => {
    let temp = this.state.quantity;

    if (parseFloat(temp[index]) + change >= 0) {
      temp[index] = parseFloat(temp[index]);
      temp[index] += change;
      temp[index] = temp[index].toString();

      this.setState({ quantity: temp });
    }
  }
}

export default NutritionScreen;