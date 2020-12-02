import React, { Component } from 'react';
import { View, Alert, StatusBar } from 'react-native';
import {
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
  Text
} from 'native-base';
import Axios from 'axios';
import { UserState } from '../../redux/user/types';
import { AppState } from '../../redux/store';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../redux/user/actions';
import { vehicle } from './home';
import { REACT_APP_IP_ADDRESS } from '@env';

interface ViewVehicleProps {
  navigation: any;
  route: any;
  user: UserState;
  updateCurrentUser: typeof updateCurrentUser;
}

class ViewVehicle extends Component<ViewVehicleProps> {
  state = {
    id: '',
    year: '',
    make: '',
    model: '',
    licensePlate: '',
    color: ''
  };

  componentDidMount = () => {
    const userVehicles: any[] = this.props.user.vehicles;
    const newV: vehicle | undefined = userVehicles.find(
      v => v._id === this.props.route.params.id
    );
    if (newV) {
      this.setState({
        id: newV.id,
        year: newV.year,
        make: newV.make,
        model: newV.model,
        licensePlate: newV.licensePlate,
        color: newV.color
      });
    }
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

  handleDelete = () => {
    Axios.delete(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/vehicles/removeVehicle/${this.props.route.params.id}`,
      {
        headers: {
          sessionId: this.props.user.sessionId
        }
      }
    )
      .then(resp => {
        const newUser: UserState = {
          ...resp.data.data
        };
        this.props.updateCurrentUser(newUser);
        Alert.alert(
          'Deletion successful!',
          `Your ${this.state.model} has been removed from Parkour.`,
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.popToTop()
            }
          ]
        );
      })
      .catch(error => {
        Alert.alert(
          'Oh no!',
          `We're having some trouble removing your ${this.state.model} from Parkour.`
        );
        console.log(error.response.data);
      });
  };

  handleUpdate = () => {
    Axios.put(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/vehicles/updateVehicle/${this.props.route.params.id}`,
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
          ...resp.data.data
        };
        this.props.updateCurrentUser(newUser);
        Alert.alert(
          'Update successful!',
          `You just updated your ${this.state.model}.`,
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.popToTop()
            }
          ]
        );
      })
      .catch(error => {
        Alert.alert(
          'Oh no!',
          `We're having some trouble updating your ${this.state.model}.`
        );
        console.log(error.response.data);
      });
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
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>Edit Vehicle</H1>
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
            <Form
              style={{ margin: 10, justifyContent: 'space-between', flex: 1 }}
            >
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
                rounded
                onPress={this.handleUpdate}
                style={{
                  backgroundColor: '#5DADE2'
                }}
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}>
                  Update
                </Text>
                <Icon type="Feather" name="refresh-cw" />
              </Button>
              <Button
                block
                iconRight
                rounded
                onPress={this.handleDelete}
                style={{
                  backgroundColor: '#AF7AC5'
                }}
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}>
                  Delete
                </Text>
                <Icon type="AntDesign" name="delete" />
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

export default connect(mapStateToProps, { updateCurrentUser })(ViewVehicle);
