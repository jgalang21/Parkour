import { Button, Icon, ListItem } from 'native-base';
import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';

interface ListingProps {
  navigation?: any;
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  numSpots: any;
  price: any;
  startDate: any;
  endDate: any;
  myListings: boolean;
  handleDelete?(): void;
  handleUpdate?(): void;
}

export default class Listing extends Component<ListingProps> {
  render() {
    var startTime = new Date(this.props.startDate);
    var endTime = new Date(this.props.endDate);
    return (
      <ListItem
        onPress={this.props.handleUpdate}
        style={{
          justifyContent: 'space-between'
        }}
      >
        <View>
          <Text
            style={{
              color: '#34495E',
              fontWeight: 'bold',
              fontSize: 20,
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              textAlign: 'left'
            }}
          >
            {this.props.street +
              ', ' +
              this.props.city +
              '\n' +
              this.props.numSpots +
              ' spots left' +
              '\n'}
          </Text>
          <Text
            style={{
              color: '#34495E',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              textAlign: 'left'
            }}
          >
            Start
            {': ' + startTime.toUTCString() + '\n'}
            End:
            {' ' + endTime.toUTCString()}
          </Text>
        </View>
        <Button
          onPress={() => {
            if (this.props.myListings) {
              this.props.navigation.push('Edit', {
                id: this.props.id
              });
            } else {
              Alert.alert(
                'Ready to pay your host?',
                'Click OK below to begin the payment process!'
              );
            }
          }}
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
