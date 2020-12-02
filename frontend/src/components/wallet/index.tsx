import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Wallet from './wallet';
import AddPayment from './addPayment';

const Stack = createStackNavigator();

interface WalletStackProps {
  navigation: any;
}

export default class WalletStack extends Component<WalletStackProps> {
  render() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="Home">
        <Stack.Screen name="Home" component={Wallet} />
        <Stack.Screen name="Add" component={AddPayment} />
      </Stack.Navigator>
    );
  }
}
