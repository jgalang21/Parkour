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
import { AppState } from '../../redux/store';
import { updateCurrentUser } from '../../redux/user/actions';
import { updateSession } from '../../redux/system/actions';
import { connect } from 'react-redux';
import { StatusBar, View } from 'react-native';
import axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';
import { getUser } from '../../common/helpers';

interface SignInProps {
  updateCurrentUser: typeof updateCurrentUser;
  updateSession: typeof updateSession;
  close(): void;
}

class SignIn extends Component<SignInProps> {
  state = {
    email: '',
    password: '',
    error: false
  };

  logIn = async () => {
    axios
      .post(`http://${REACT_APP_IP_ADDRESS}:8080/api/auth/login`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(async resp => {
        const user = await getUser(resp.data.data.sessionId);
        if (!user) this.setState({ error: true });
        else {
          this.props.updateCurrentUser(user);
          this.props.updateSession({
            loggedIn: true
          });
        }
      })
      .catch(error => {
        this.setState({ error: true });
        console.log('error: ' + error.message);
      });
  };

  onChangeEmail = (text: string) => {
    this.setState({
      email: text
    });
  };

  onChangePassword = (text: string) => {
    this.setState({
      password: text
    });
  };

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
            <View>
              <Icon
                type="Octicons"
                name="sign-in"
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
                Sign In
              </H1>
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
                  <Label>Email</Label>
                  <Input
                    autoCapitalize="none"
                    autoFocus
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
                    paddingLeft: 10
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
                <Button
                  block
                  rounded
                  onPress={() => {
                    this.logIn();
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
                    backgroundColor: '#76D7C4'
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>Continue</Text>
                </Button>
              </Form>
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

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { updateSession, updateCurrentUser })(
  SignIn
);
