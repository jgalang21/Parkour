import { Button, Icon, ListItem } from 'native-base';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { vehicle } from './home';

interface VehicleProps {
  v: vehicle;
  navigation: any;
}

export default class Vehicle extends Component<VehicleProps> {
  render() {
    return (
      <ListItem
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name="car"
            type="FontAwesome"
            style={{ color: '#3498DB', fontSize: 64, marginRight: 20 }}
          />
          <View
            style={{
              alignItems: 'flex-start',
              alignContent: 'center',
              flexDirection: 'column'
            }}
          >
            <Text
              style={{
                color: '#34495E',
                fontWeight: 'bold',
                fontSize: 24,
                textAlign: 'left'
              }}
            >
              {this.props.v.make}
            </Text>
            <Text
              style={{
                color: '#5D6D7E',
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'left'
              }}
            >
              {this.props.v.model}
            </Text>
          </View>
        </View>
        <Button
          onPress={() =>
            this.props.navigation.push('View', {
              id: this.props.v.id
            })
          }
          icon
          transparent
          style={{ alignSelf: 'center' }}
        >
          <Icon
            name="caretright"
            type="AntDesign"
            style={{ color: '#34495E' }}
          />
        </Button>
      </ListItem>
    );
  }
}
