import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './profile';
import EditProfile from './editProfile';

const Stack = createStackNavigator();

interface ProfileStackProps {
  navigation: any;
}

export default class ProfileStack extends Component<ProfileStackProps> {
  render() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="Profile">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Edit" component={EditProfile} />
      </Stack.Navigator>
    );
  }
}
