import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { AppState } from '../../redux/store';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { SystemState } from '../../redux/system/types';
import { updateCurrentUser } from '../../redux/user/actions';
import { updateSession } from '../../redux/system/actions';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Button, H1, Icon, Picker, Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

interface CustomDrawerProps {
  user: UserState;
  system: SystemState;
  updateCurrentUser: typeof updateCurrentUser;
  updateSession: typeof updateSession;
  state: any;
  navigation: any;
  descriptors: any;
  progress: any;
}

class CustomDrawer extends Component<CustomDrawerProps> {
  logOut = async () => {
    await AsyncStorage.removeItem('sessionId')
      .then(
        async () =>
          await AsyncStorage.removeItem('id')
            .then(() => {
              const loggedOutUser: UserState = {
                email: '',
                password: '',
                phoneNumber: '',
                fullName: '',
                host: false,
                vehicles: '',
                stripeId: '',
                sessionId: '',
                id: ''
              };
              this.props.updateCurrentUser(loggedOutUser);
              this.props.updateSession({
                loggedIn: false
              });
            })
            .catch(() =>
              Alert.alert(
                'There are worse things...',
                "We're having some trouble logging you out at this time :("
              )
            )
      )
      .catch(() =>
        Alert.alert(
          'There are worse things...',
          "We're having some trouble logging you out at this time :("
        )
      );
  };

  handleChangeRole = () => {
    const newUser: UserState = {
      ...this.props.user,
      host: !this.props.user.host
    };
    console.log(newUser);
    this.props.updateCurrentUser(newUser);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#34495E' }}>
        <View
          style={{
            backgroundColor: '#48C9B0',
            paddingLeft: 10,
            paddingBottom: 0,
            padding: 30,
            paddingRight: 0
          }}
        >
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Profile')}
            >
              <Thumbnail
                large
                style={{
                  backgroundColor: 'lightblue',
                  marginRight: 10,
                  borderColor: '#6FFFB0',
                  borderWidth: 3
                }}
                source={{
                  uri:
                    'https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png'
                }}
              />
              <H1 style={{ fontWeight: 'bold', color: 'white' }}>
                {this.props.user.fullName.split(' ')[0] || 'Stranger'}
              </H1>
            </Button>
          </View>
          <Picker
            onValueChange={this.handleChangeRole}
            style={{
              marginTop: 30,
              color: 'white',
              width: '100%'
            }}
            mode="dropdown"
            itemStyle={{ fontWeight: 'bold' }}
            headerStyle={{ backgroundColor: 'white' }}
            iosHeader="Driver or Host?"
            selectedValue={this.props.user.host ? 'key1' : 'key0'}
            iosIcon={<Icon name="arrow-down" />}
          >
            <Picker.Item
              label={this.props.user.host ? 'Switch to Driver' : 'Driver'}
              value="key0"
            />
            <Picker.Item
              label={this.props.user.host ? 'Host' : 'Switch to Host'}
              value="key1"
            />
          </Picker>
        </View>
        <DrawerContentScrollView {...this.props}>
          <DrawerItem
            label="Map"
            onPress={() => this.props.navigation.navigate('Map')}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            icon={() => (
              <Icon
                type="FontAwesome5"
                name="map-marked-alt"
                style={{ color: 'white' }}
              />
            )}
          />
          <DrawerItem
            label="My Vehicles"
            onPress={() => this.props.navigation.navigate('Vehicle')}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            icon={() => (
              <Icon type="FontAwesome" name="car" style={{ color: 'white' }} />
            )}
          />
          <DrawerItem
            label="My Wallet"
            onPress={() => this.props.navigation.navigate('Wallet')}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            icon={() => (
              <Icon
                type="FontAwesome5"
                name="wallet"
                style={{ color: 'white' }}
              />
            )}
          />
          {this.props.user.host && (
            <DrawerItem
              label="My Listings"
              onPress={() => this.props.navigation.navigate('Listing')}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
              icon={() => (
                <Icon type="AntDesign" name="home" style={{ color: 'white' }} />
              )}
            />
          )}
          <DrawerItem
            label="Available Listings"
            onPress={() =>
              this.props.navigation.navigate('AllListings', {
                mode: 'all'
              })
            }
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            icon={() => (
              <Icon
                type="Feather"
                name="navigation"
                style={{ color: 'white' }}
              />
            )}
          />
          <DrawerItem
            label="Log out"
            onPress={this.logOut}
            labelStyle={{ color: 'white', fontWeight: 'bold' }}
            icon={() => (
              <Icon type="AntDesign" name="logout" style={{ color: 'white' }} />
            )}
          />
        </DrawerContentScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  system: state.system
});

export default connect(mapStateToProps, { updateSession, updateCurrentUser })(
  CustomDrawer
);
