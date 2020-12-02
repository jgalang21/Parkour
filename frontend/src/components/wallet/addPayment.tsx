import React, { Component } from 'react';
import {
  Button,
  Container,
  Content,
  H1,
  Header,
  Icon,
  Form,
  Item,
  Label,
  Input,
  Text
} from 'native-base';
import { Alert, StatusBar, View } from 'react-native';
import { UserState } from '../../redux/user/types';
import { AppState } from '../../redux/store';
import { connect } from 'react-redux';
import axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';

interface AddPaymentProps {
  user: UserState;
  navigation: any;
}

class AddPayment extends Component<AddPaymentProps> {
  state = {
    cardNumber: '',
    date: '',
    cvc: '',
    zip: '',
    valid: false
  };

  cardNumberOnChange = (value: string) => {
    this.setState({ cardNumber: value });
  };

  dateOnChange = (value: string) => {
    this.setState({ date: value });
  };

  cvcOnChange = (value: string) => {
    this.setState({ cvc: value });
  };

  zipOnChange = (value: string) => {
    this.setState({ zip: value });
  };

  formatDate = (date: string) => {
    if (date.length < 2) {
      return date;
    } else {
      if (date.length === 2 && this.state.date.length === 3) {
        return date;
      } else if (date.length === 2) {
        return date + '/';
      }
      return date;
    }
  };

  isComplete = () => {
    return (
      this.state.cardNumber &&
      this.state.date &&
      this.state.cvc &&
      this.state.zip
    );
  };

  addCard = async () => {
    const source = {
      object: 'card',
      number: this.state.cardNumber,
      exp_month: +this.state.date.substring(0, 2),
      exp_year: +this.state.date.substring(3, 5),
      cvc: this.state.cvc,
      address_zip: this.state.zip,
      name: this.props.user.fullName
    };

    const resp: any = await axios.post(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/addCard`,
      { source: source },
      {
        headers: { sessionId: this.props.user.sessionId }
      }
    );

    if (resp.data.data.id) {
      Alert.alert(
        'Success!',
        'Card has been added to your Parkour digital wallet!',
        [
          {
            text: 'Okay'
          }
        ]
      );
    } else {
      Alert.alert(
        'Failure :(',
        'Something went wrong while trying to save your new card to your Parkour digital wallet!',
        [
          {
            text: 'Okay'
          }
        ]
      );
    }
  };

  render() {
    return (
      <Container style={{ backgroundColor: '#34495E' }}>
        <Header
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginBottom: 10,
            marginTop: 30,
            elevation: 0
          }}
          iosBarStyle="light-content"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button transparent onPress={this.props.navigation.goBack}>
              <Icon name="cancel" type="MaterialIcons" />
            </Button>
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>New Card</H1>
          </View>
          <Button style={{ borderRadius: 50 }} rounded disabled transparent>
            <Icon
              type="AntDesign"
              name="checkcircle"
              style={{ color: this.isComplete() ? '#48C9B0' : '#A2423D' }}
            />
          </Button>
        </Header>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: 10,
            backgroundColor: 'white'
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              alignContent: 'center'
            }}
          >
            <Form style={{ alignItems: 'center' }}>
              <Icon
                type="AntDesign"
                name="creditcard"
                style={{ fontSize: 64, color: '#00739D' }}
              />
              <Item floatingLabel>
                <Label style={{ fontWeight: 'bold' }}>Card Number</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.cardNumber}
                  onChangeText={value => {
                    if (value.length <= 16) {
                      this.cardNumberOnChange(value);
                    }
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label style={{ fontWeight: 'bold' }}>MM/YY</Label>
                <Input
                  value={this.state.date}
                  keyboardType="numeric"
                  onChangeText={value => {
                    if (value.length <= 5) {
                      const formattedDate = this.formatDate(value);
                      this.dateOnChange(formattedDate);
                    }
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label style={{ fontWeight: 'bold' }}>CVC</Label>
                <Input
                  value={this.state.cvc}
                  keyboardType="numeric"
                  onChangeText={value => {
                    if (value.length <= 3) {
                      this.cvcOnChange(value);
                    }
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label style={{ fontWeight: 'bold' }}>ZIP</Label>
                <Input
                  value={this.state.zip}
                  keyboardType="numeric"
                  onChangeText={value => {
                    if (value.length <= 5) {
                      this.zipOnChange(value);
                    }
                  }}
                />
              </Item>
              <Button
                block
                rounded
                success={this.isComplete() ? true : false}
                disabled={this.isComplete() ? false : true}
                style={{
                  margin: 30
                }}
                onPress={this.addCard}
              >
                <Text>Finish</Text>
              </Button>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(AddPayment);
