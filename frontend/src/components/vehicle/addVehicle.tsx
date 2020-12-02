import React, { Component } from 'react';
import { View, Alert, StatusBar } from 'react-native';
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
  Header
} from 'native-base';
import axios from 'axios';
import { UserState } from '../../redux/user/types';
import { AppState } from '../../redux/store';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../redux/user/actions';
import { REACT_APP_IP_ADDRESS } from '@env';

interface AddVehicleProps {
  navigation: any;
  user: UserState;
  updateCurrentUser: typeof updateCurrentUser;
}

class AddVehicle extends Component<AddVehicleProps> {
  state = {
    licensePlate: '',
    make: '',
    model: '',
    year: '',
    color: ''
  };

  onChangeLicensePlate = (text: string) => {
    this.setState({
      licensePlate: text
    });
  };

  onChangeMake = (text: string) => {
    this.setState({
      make: text
    });
  };

  onChangeModel = (text: string) => {
    this.setState({
      model: text
    });
  };

  onChangeYear = (text: string) => {
    this.setState({
      year: text
    });
  };

  onChangeColor = (text: string) => {
    this.setState({
      color: text
    });
  };

  handleSubmit = () => {
    axios
      .post(
        `http://${REACT_APP_IP_ADDRESS}:8080/api/vehicles/registerVehicle`,
        {
          color: this.state.color,
          make: this.state.make,
          model: this.state.model,
          year: this.state.year,
          licensePlate: this.state.licensePlate
        },
        {
          headers: {
            sessionId: this.props.user.sessionId
          }
        }
      )
      .then(resp => {
        const newUser: UserState = {
          ...this.props.user,
          vehicles: resp.data.data.vehicles
        };
        this.props.updateCurrentUser(newUser);
        Alert.alert(
          'Success!',
          `You just added your ${this.state.model} to your Parkour vehicles collection!`
        );
        this.props.navigation.popToTop();
      })
      .catch(() => {
        Alert.alert(
          'Uh-oh :(',
          `We're having some trouble adding your ${this.state.model} to your Parkour vehicle collection.`
        );
      });
  };

  isComplete = () => {
    return (
      this.state.licensePlate &&
      this.state.make &&
      this.state.model &&
      this.state.year &&
      this.state.color
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
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>New Vehicle</H1>
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
            <Form style={{ margin: 10 }}>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 10,
                  paddingLeft: 10
                }}
              >
                <Label>License Plate</Label>
                <Input
                  value={this.state.licensePlate}
                  onChangeText={text => this.onChangeLicensePlate(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 10,
                  paddingLeft: 10
                }}
              >
                <Label>Make</Label>
                <Input
                  value={this.state.make}
                  onChangeText={text => this.onChangeMake(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 10,
                  paddingLeft: 10
                }}
              >
                <Label>Model</Label>
                <Input
                  value={this.state.model}
                  onChangeText={text => this.onChangeModel(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 10,
                  paddingLeft: 10
                }}
              >
                <Label>Year</Label>
                <Input
                  value={this.state.year}
                  onChangeText={text => this.onChangeYear(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  margin: 10,
                  paddingLeft: 10
                }}
              >
                <Label>Color</Label>
                <Input
                  value={this.state.color}
                  onChangeText={text => this.onChangeColor(text)}
                />
              </Item>
              <Button
                block
                iconRight
                disabled={this.isComplete() ? false : true}
                rounded
                onPress={this.handleSubmit}
                style={{
                  margin: 20,
                  alignSelf: 'center',
                  backgroundColor: this.isComplete() ? '#fc466b' : undefined
                }}
              >
                <Text
                  style={{ fontWeight: 'bold' }}
                  onPress={this.handleSubmit}
                >
                  Add
                </Text>
                <Icon type="FontAwesome5" name="car-side" />
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

export default connect(mapStateToProps, { updateCurrentUser })(AddVehicle);
