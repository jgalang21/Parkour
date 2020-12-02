import { REACT_APP_IP_ADDRESS } from '@env';
import { Button, Icon, ListItem, Text } from 'native-base';
import React, { Component } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { card } from './wallet';

interface CardProps {
  card: card;
  token: string;
  handleDelete(deletedCard: any): void;
  handleUpdate(): void;
}

export default class Card extends Component<CardProps> {
  render() {
    return (
      <ListItem
        onPress={() => {
          Alert.alert('Options', 'Set card to default payment method?', [
            {
              text: 'Yes',
              onPress: async () => {
                await axios.put(
                  `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/updateCard`,
                  { cardId: this.props.card.id },
                  {
                    headers: {
                      sessionId: this.props.token
                    }
                  }
                );
                this.props.handleUpdate();
              }
            },
            { text: 'No' }
          ]);
        }}
        style={{
          justifyContent: 'space-between'
        }}
      >
        <Text
          style={{
            color: this.props.card.default ? '#48C9B0' : '#34495E',
            fontWeight: 'bold',
            marginRight: 20
          }}
        >
          {this.props.card.title}
        </Text>
        <Button
          rounded
          style={{ backgroundColor: '#A2423D' }}
          onPress={() => {
            Alert.alert(
              'Danger Zone!',
              'Are you sure you want to delete this payment method?',
              [
                {
                  text: 'Yes',
                  onPress: async () => {
                    const resp: any = await axios.delete(
                      `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/removeCard/${this.props.card.id}`,
                      {
                        data: {
                          cardId: this.props.card.id
                        },
                        headers: {
                          sessionId: this.props.token
                        }
                      }
                    );
                    this.props.handleDelete(resp.data.data.id);
                  }
                },
                { text: 'No' }
              ]
            );
          }}
        >
          <Icon name="delete" type="AntDesign" style={{ color: 'white' }} />
        </Button>
      </ListItem>
    );
  }
}
