import React, { Component } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import {
  Text,
  Button,
  Container,
  Content,
  Item,
  Label,
  Input,
  H1,
  Icon,
  Form,
  Header,
  DatePicker
} from 'native-base';
import Axios from 'axios';
import { REACT_APP_IP_ADDRESS, REACT_APP_GOOGLE_API_KEY } from '@env';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { AppState } from 'src/redux/store';
import { ScrollView } from 'react-native-gesture-handler';

interface AddListingProps {
  navigation: any;
  user: UserState;
}

class AddListing extends Component<AddListingProps> {
  state = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    numSpots: '',
    price: '',
    startDate: new Date(),
    endDate: new Date()
  };

  onChangeStreet = (text: string) => {
    this.setState({
      street: text
    });
  };

  onChangeCity = (text: string) => {
    this.setState({
      city: text
    });
  };

  onChangeState = (text: string) => {
    this.setState({
      state: text
    });
  };

  onChangeZipCode = (text: string) => {
    this.setState({
      zipCode: text
    });
  };

  onChangeNumSpots = (text: string) => {
    this.setState({
      numSpots: text
    });
  };

  onChangeNumPrice = (text: string) => {
    this.setState({
      price: text
    });
  };
  onChangeStartDate = (text: string) => {
    console.log(text);
    this.setState({
      startDate: text
    });
  };

  onChangeEndDate = (text: string) => {
    console.log(text);
    this.setState({
      endDate: text
    });
  };

  handleSubmit = async () => {
    const address = {
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode
    };
    const street = address.street.replace(/\s+/g, '+');
    const city = address.city.replace(/\s+/g, '+');

    const resp = await Axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${street}+${city},${address.state}&key=${REACT_APP_GOOGLE_API_KEY}&libraries=geometry`
    );

    const coordinates = resp.data.results[0].geometry.location;
    await Axios.post(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/listings/addListing`,
      {
        address: address,
        numSpots: this.state.numSpots,
        price: this.state.price,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        longitude: coordinates.lng,
        latitude: coordinates.lat
      },
      {
        headers: {
          sessionId: this.props.user.sessionId
        }
      }
    )
      .then(() => {
        Alert.alert('Success!', 'You successfully added a new listing!');
        this.props.navigation.popToTop();
      })
      .catch(err => {
        Alert.alert('Oh no!', "We couldn't add your listing at this time :(");
        console.log(err);
      });
  };

  isComplete = () => {
    return (
      this.state.street &&
      this.state.city &&
      this.state.state &&
      this.state.zipCode &&
      this.state.numSpots &&
      this.state.startDate &&
      this.state.endDate &&
      this.state.price
    );
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
            <Button transparent onPress={this.props.navigation.popToTop}>
              <Icon name="cancel" type="MaterialIcons" />
            </Button>
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>New Listing</H1>
          </View>
        </Header>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 10
          }}
        >
          <ScrollView>
            <Form>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Street Name</Label>
                <Input
                  value={this.state.street}
                  onChangeText={text => this.onChangeStreet(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>City</Label>
                <Input
                  value={this.state.city}
                  onChangeText={text => this.onChangeCity(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>State</Label>
                <Input
                  value={this.state.state}
                  onChangeText={text => this.onChangeState(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Zip Code</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.zipCode}
                  onChangeText={value => {
                    if (value.length <= 5) {
                      this.onChangeZipCode(value);
                    }
                  }}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Number of Spots</Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.numSpots}
                  onChangeText={text => this.onChangeNumSpots(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Price</Label>
                <Input
                  value={this.state.price}
                  onChangeText={text => this.onChangeNumPrice(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  alignItems: 'flex-start'
                }}
              >
                <Label>Start Date</Label>
                <DatePicker
                  defaultDate={this.state.startDate}
                  locale={'en'}
                  modalTransparent
                  animationType="slide"
                  onDateChange={date => this.onChangeStartDate(date)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  alignItems: 'flex-start'
                }}
              >
                <Label>End Date</Label>
                <DatePicker
                  defaultDate={this.state.endDate}
                  locale={'en'}
                  modalTransparent
                  onDateChange={date => this.onChangeEndDate(date)}
                />
              </Item>
            </Form>
          </ScrollView>
          <Button
            block
            iconRight
            disabled={this.isComplete() ? false : true}
            rounded
            onPress={this.handleSubmit}
            style={{
              alignSelf: 'center',
              backgroundColor: this.isComplete() ? '#fc466b' : undefined,
              margin: 20
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Add</Text>
            <Icon type="FontAwesome5" name="house-user" />
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(AddListing);
