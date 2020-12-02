import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { SystemState } from '../../redux/system/types';
import { updateSession } from '../../redux/system/actions';
import {
  Content,
  Container,
  H1,
  Button,
  Text,
  Icon,
  Spinner
} from 'native-base';
import { StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SignIn from './signIn';
import SignUp from './signUp';
import Home from '../home';
import AsyncStorage from '@react-native-community/async-storage';
import { getUser } from '../../common/helpers';
import { UserState } from '../../redux/user/types';
import { updateCurrentUser } from '../../redux/user/actions';

interface AppProps {
  system: SystemState;
  user: UserState;
  navigation: any;
  updateCurrentUser: typeof updateCurrentUser;
  updateSession: typeof updateSession;
}

class Login extends Component<AppProps> {
  state = {
    showSignIn: false,
    showSignUp: false,
    loading: true
  };

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('sessionId');
    console.log(token);
    if (token !== null) {
      // so it doesn't infinitely load on the off chance async isn't responding
      setTimeout(() => this.setState({ loading: false }), 5000);
      const user = await getUser(token);
      if (user) {
        this.props.updateCurrentUser(user);
        this.props.updateSession({
          loggedIn: true
        });
      }
    }
    this.setState({ loading: false });
  };

  render() {
    if (this.props.system.loggedIn) {
      return <Home />;
    } else {
      return (
        <Container>
          <StatusBar backgroundColor="#7314ff" barStyle="light-content" />
          <Content
            contentContainerStyle={{
              justifyContent: 'center',
              flex: 1
            }}
          >
            <LinearGradient
              colors={['#7314ff', '#2dbeff']}
              style={{ height: '100%', justifyContent: 'center', flex: 1 }}
            >
              {this.state.loading ? (
                <Spinner />
              ) : (
                !this.state.showSignIn &&
                !this.state.showSignUp && (
                  <View>
                    <View style={{ padding: 10 }}>
                      <Icon
                        type="FontAwesome"
                        name="car"
                        style={{
                          color: 'white',
                          fontSize: 128,
                          alignSelf: 'center',
                          margin: 10
                        }}
                      />
                      <H1
                        style={{
                          color: 'white',
                          fontSize: 32,
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        Parkour
                      </H1>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        Find better parking
                      </Text>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Button
                        block
                        primary
                        rounded
                        onPress={() => this.setState({ showSignIn: true })}
                        style={{
                          margin: 10,
                          alignSelf: 'center',
                          backgroundColor: '#76D7C4'
                        }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
                      </Button>
                      <Button
                        rounded
                        onPress={() => this.setState({ showSignUp: true })}
                        block
                        style={{
                          alignSelf: 'center',
                          margin: 10,
                          backgroundColor: '#7A35FF'
                        }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
                      </Button>
                    </View>
                  </View>
                )
              )}
              {this.state.showSignIn && (
                <SignIn close={() => this.setState({ showSignIn: false })} />
              )}
              {this.state.showSignUp && (
                <SignUp close={() => this.setState({ showSignUp: false })} />
              )}
            </LinearGradient>
          </Content>
        </Container>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  system: state.system,
  user: state.user
});

export default connect(mapStateToProps, { updateSession, updateCurrentUser })(
  Login
);
