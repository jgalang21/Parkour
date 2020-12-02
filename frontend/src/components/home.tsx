import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HostMap from './hostMap';
import CustomDrawer from './drawer/customDrawer';
import WalletStack from './wallet/index';
import Vehicle from './vehicle/index';
import AllListings from './listings/all_listings';
import ListingStack from './add_listing';
import Profile from './profile';

const DrawerNavigator = createDrawerNavigator();

class Home extends Component {
  render() {
    return (
      <DrawerNavigator.Navigator
        hideStatusBar
        statusBarAnimation="slide"
        initialRouteName="Map"
        screenOptions={{ swipeEnabled: true }}
        drawerContent={(props: any) => <CustomDrawer {...props} />}
        drawerContentOptions={{
          contentContainerStyle: { backgroundColor: '#34495E' }
        }}
      >
        <DrawerNavigator.Screen name="Profile" component={Profile} />
        <DrawerNavigator.Screen name="Map" component={HostMap}/>
        <DrawerNavigator.Screen name="Wallet" component={WalletStack} />
        <DrawerNavigator.Screen name="Vehicle" component={Vehicle} />
        <DrawerNavigator.Screen name="Listing" component={ListingStack} />
        <DrawerNavigator.Screen name="AllListings" component={AllListings} />
      </DrawerNavigator.Navigator>
    );
  }
}

export default Home;
