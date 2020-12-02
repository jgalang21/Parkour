import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddListing from './addListing';
import GetListings from './home';
import EditListing from './editListing';

const Stack = createStackNavigator();

interface ListingStackProps {
  navigation: any;
}

export default class ListingStack extends Component<ListingStackProps> {
  render() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="Home">
        <Stack.Screen name="Home" component={GetListings} />
        <Stack.Screen name="Add" component={AddListing} />
        <Stack.Screen name="Edit" component={EditListing} />
      </Stack.Navigator>
    );
  }
}
