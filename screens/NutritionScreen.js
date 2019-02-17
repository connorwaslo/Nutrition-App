import React, {Component} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'native-base';
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
      isLoading: true,
      nutriList: []
    }
  }

  async componentDidMount() {
    const {foodList} = this.state;
    let tempDescr = [];

    for (let i = 0; i < foodList.length; i++) {
      await searchFood(foodList[i]).then((result) => {
        let descr = result['foods']['food'][0]['food_description'];

        let calsStart = descr.indexOf(': ') + 2;
        let calsEnd = descr.indexOf('kcal');
        let cals = parseFloat(descr.substring(calsStart, calsEnd));
        console.log('Cals:', cals);

        let fatStart = descr.indexOf('Fat: ') + 'Fat: '.length;
        let fatEnd = descr.indexOf(' | Carbs:') - 1;
        let fat = parseFloat(descr.substring(fatStart, fatEnd));
        console.log('Fat:', fat);

        let carbsStart = descr.indexOf('Carbs: ') + 'Carbs: '.length;
        let carbsEnd = descr.indexOf(' | Protein') - 1;
        let carbs = parseFloat(descr.substring(carbsStart, carbsEnd));
        console.log('Carbs:', carbs);

        let proStart = descr.indexOf('Protein: ') + 'Protein: '.length;
        let proEnd = descr.length - 1;
        let protein = parseFloat(descr.substring(proStart, proEnd));
        console.log('Protein:', protein);

        let serving = descr.substring(0, descr.indexOf('-') - 1);

        tempDescr.push(result['foods']['food'][0]['food_description']);
        console.log('Quantity:', this.state.quantity);
        let nutrition = {
          food: foodList[i],
          servingSize: serving,
          cals: cals,
          fat: fat,
          carbs: carbs,
          protein: protein,
          numServings: parseFloat(this.state.quantity[i])
        };

        // Add to state
        let tempNutri = this.state.nutriList;
        tempNutri.push(nutrition);
        this.setState({ nutriList: tempNutri });

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
    console.log(this.state.quantity);
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>Loading...</Text>
        </View>
      )
    }

    return (
      <View style={{ flex: 1}}>
        <ScrollView style={{ flex: 1, marginTop: '5%', marginBottom: '5%' }}>
          {this._checkForFood()}

          {this._renderFoodButtons()}
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <Button block primary onPress={this._submitMeal.bind(this)}>
            <Text style={{ textAlign: 'center', color: 'white' }}>Submit Meal</Text>
          </Button>
        </View>
      </View>
    )
  }

  _submitMeal = () => {
    console.log('Json:', JSON.stringify(this.state.nutriList));
    // Fetch
    fetch('http://alaradegirmenci.wixsite.com/mysite/_functions/addFoodItem',
      { method: 'POST',
      body: JSON.stringify(this.state.nutriList)})
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

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

      // Also change nutriList to reflect this change
      let tempNutri = this.state.nutriList;
      tempNutri[index]['servings'] = parseFloat(temp[index]);

      this.setState({ quantity: temp, nutriList: tempNutri });
    }
  }
}

export default NutritionScreen;