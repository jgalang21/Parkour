import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddVehicle from './addVehicle';
import MyVehicles from './home';
import ViewVehicle from './viewVehicle';

const Stack = createStackNavigator();

interface VehicleStackProps {
  navigation: any;
}

export default class WalletStack extends Component<VehicleStackProps> {
  render() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="Home">
        <Stack.Screen name="Home" component={MyVehicles} />
        <Stack.Screen name="Add" component={AddVehicle} />
        <Stack.Screen name="View" component={ViewVehicle} />
      </Stack.Navigator>
    );
  }
}
