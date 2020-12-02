import React, { Component } from 'react';
import {
  Text,
  Button,
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  H1,
  Icon,
  Toast
} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar, View, Image } from 'react-native';
import { REACT_APP_IP_ADDRESS } from '@env';

const Tab = createMaterialTopTabNavigator();

interface SignUpProps {
  close(): void;
}

export default class SignUp extends Component<SignUpProps> {
  state = {
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    error: false
  };

  signUp = async () => {
    await axios
      .post(`http://${REACT_APP_IP_ADDRESS}:8080/api/auth/register`, {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        phoneNumber: this.state.phoneNumber,
        host: false
      })
      .then(() => {
        this.props.close();
      })
      .catch(error => {
        this.setState({ error: true });
        console.log(error.message);
      });
  };

  onChangePassword = (text: string) => {
    this.setState({
      password: text
    });
  };

  onChangeEmail = (text: string) => {
    this.setState({
      email: text
    });
  };

  onChangePhoneNumber = (text: string) => {
    this.setState({
      phoneNumber: text
    });
  };

  onChangeFirstName = (text: string) => {
    this.setState({
      firstName: text
    });
  };

  onChangeLastName = (text: string) => {
    this.setState({
      lastName: text
    });
  };

  PhoneNumber = (props: any) => (
    <View>
      <Image
        style={{
          resizeMode: 'cover',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        source={{
          uri:
            'https://coolbackgrounds.io/images/backgrounds/white/white-triangle-369b8d2d.jpg'
        }}
      />
      <Form
        style={{
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          padding: 10
        }}
      >
        <Item
          stackedLabel
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            margin: 10,
            paddingLeft: 10,
            elevation: 10
          }}
        >
          <Label>Phone Number</Label>
          <Input
            keyboardType="phone-pad"
            value={this.state.phoneNumber}
            onChangeText={text => this.onChangePhoneNumber(text)}
          />
        </Item>
        <View
          style={{
            justifyContent: 'flex-end',
            flexDirection: 'row'
          }}
        >
          <Button
            icon
            primary
            rounded
            onPress={() => props.navigation.navigate('name')}
            style={{
              margin: 10,
              alignSelf: 'center',
              backgroundColor: '#34495E',
              elevation: 10
            }}
          >
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-right"
              style={{
                alignSelf: 'center',
                color: 'white'
              }}
            />
          </Button>
        </View>
      </Form>
    </View>
  );

  Credentials = (props: any) => (
    <View>
      <Image
        style={{
          resizeMode: 'cover',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        source={{
          uri:
            'https://coolbackgrounds.io/images/backgrounds/white/white-triangle-369b8d2d.jpg'
        }}
      />
      <Form
        style={{
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          padding: 10
        }}
      >
        <View>
          <Item
            stackedLabel
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              margin: 10,
              paddingLeft: 10,
              elevation: 10
            }}
          >
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={text => this.onChangeEmail(text)}
            />
          </Item>
          <Item
            stackedLabel
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              margin: 10,
              paddingLeft: 10,
              elevation: 10
            }}
          >
            <Label>Password</Label>
            <Input
              autoCapitalize="none"
              secureTextEntry
              value={this.state.password}
              onChangeText={text => this.onChangePassword(text)}
            />
          </Item>
        </View>
        <View>
          <Button
            block
            primary
            rounded
            onPress={() => {
              this.signUp();
              if (this.state.error) {
                Toast.show({
                  text: 'Please enter in valid credentials!',
                  buttonText: 'Okay',
                  duration: 4000,

                  style: { backgroundColor: '#34495E' }
                });
              }
            }}
            style={{
              margin: 10,
              alignSelf: 'center',
              backgroundColor: '#76D7C4',
              elevation: 10
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Submit</Text>
          </Button>
          <Button
            icon
            primary
            rounded
            onPress={() => props.navigation.navigate('name')}
            style={{
              margin: 10,
              alignSelf: 'center',
              backgroundColor: '#34495E',
              elevation: 10
            }}
          >
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-left"
              style={{
                alignSelf: 'center',
                color: 'white'
              }}
            />
          </Button>
        </View>
      </Form>
    </View>
  );

  Name = (props: any) => (
    <View>
      <Image
        style={{
          resizeMode: 'cover',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        source={{
          uri:
            'https://coolbackgrounds.io/images/backgrounds/white/white-triangle-369b8d2d.jpg'
        }}
      />
      <Form
        style={{
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          position: 'absolute',
          bottom: 0,
          padding: 10
        }}
      >
        <View>
          <Item
            stackedLabel
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              margin: 10,
              paddingLeft: 10,
              elevation: 10
            }}
          >
            <Label>First name</Label>
            <Input
              value={this.state.firstName}
              onChangeText={text => this.onChangeFirstName(text)}
            />
          </Item>
          <Item
            stackedLabel
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              margin: 10,
              paddingLeft: 10,
              elevation: 10
            }}
          >
            <Label>Last Name</Label>
            <Input
              value={this.state.lastName}
              onChangeText={text => this.onChangeLastName(text)}
            />
          </Item>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}
        >
          <Button
            icon
            primary
            rounded
            onPress={() => props.navigation.navigate('phone')}
            style={{
              margin: 10,
              alignSelf: 'center',
              backgroundColor: '#34495E',
              elevation: 10
            }}
          >
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-left"
              style={{
                alignSelf: 'center',
                color: 'white'
              }}
            />
          </Button>
          <Button
            icon
            primary
            rounded
            onPress={() => props.navigation.navigate('credentials')}
            style={{
              margin: 10,
              alignSelf: 'center',
              backgroundColor: '#34495E',
              elevation: 10
            }}
          >
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-right"
              style={{
                alignSelf: 'center',
                color: 'white'
              }}
            />
          </Button>
        </View>
      </Form>
    </View>
  );

  render() {
    return (
      <Container style={{ backgroundColor: '#2dbeff' }}>
        <StatusBar backgroundColor="#2dbeff" barStyle="light-content" />
        <Content
          contentContainerStyle={{
            height: '100%',
            justifyContent: 'space-between'
          }}
        >
          <LinearGradient
            colors={['#2dbeff', '#7314ff']}
            style={{
              padding: 10,
              height: '100%',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1 }}>
              <Icon
                type="FontAwesome"
                name="user-plus"
                style={{
                  alignSelf: 'center',
                  margin: 10,
                  color: 'white',
                  fontSize: 64
                }}
              />
              <H1
                style={{
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                Sign Up
              </H1>
              <Tab.Navigator
                style={{
                  borderRadius: 20,
                  marginTop: 10,
                  opacity: 0.9,
                  borderColor: '#34495E',
                  borderWidth: 3,
                  elevation: 20
                }}
                tabBarOptions={{
                  indicatorStyle: { backgroundColor: '#6FFFB0' },
                  activeTintColor: '#34495E',
                  pressColor: '#34495E'
                }}
              >
                <Tab.Screen name="phone">
                  {props => <this.PhoneNumber {...props} />}
                </Tab.Screen>
                <Tab.Screen name="name">
                  {props => <this.Name {...props} />}
                </Tab.Screen>
                <Tab.Screen name="credentials">
                  {props => <this.Credentials {...props} />}
                </Tab.Screen>
              </Tab.Navigator>
            </View>
            <Button
              rounded
              info
              style={{ alignSelf: 'center', margin: 10, elevation: 10 }}
              onPress={this.props.close}
            >
              <Icon
                type="FontAwesome"
                name="close"
                style={{
                  alignSelf: 'center'
                }}
              />
            </Button>
          </LinearGradient>
        </Content>
      </Container>
    );
  }
}
