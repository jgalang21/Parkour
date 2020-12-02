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
import Axios from 'axios';
import { AppState } from '../../redux/store';
import { connect } from 'react-redux';
import { updateCurrentUser } from '../../redux/user/actions';
import { UserState } from '../../redux/user/types';
import { REACT_APP_IP_ADDRESS } from '@env';

interface EditProfileProps {
  navigation: any;
  user: UserState;
  updateCurrentUser: typeof updateCurrentUser;
}

class EditProfile extends Component<EditProfileProps> {
  state = {
    firstName: this.props.user.fullName.split(' ')[0],
    lastName: this.props.user.fullName.split(' ')[1] || '',
    email: this.props.user.email,
    phoneNumber: this.props.user.phoneNumber
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

  handleSubmit = async () => {
    Axios.put(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/users/updateUser`,
      {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber
      },
      {
        headers: {
          sessionId: this.props.user.sessionId
        }
      }
    )
      .then(() => {
        const newUser: UserState = {
          ...this.props.user,
          fullName: this.state.firstName + ' ' + this.state.lastName,
          email: this.state.email,
          phoneNumber: this.state.phoneNumber
        };
        this.props.updateCurrentUser(newUser);
        Alert.alert('Success!', 'Your profile has been updated!');
        this.props.navigation.popToTop();
      })
      .catch(() => {
        Alert.alert(
          'Error :(',
          'Unfortunately, we were unable to update your profile at this time.'
        );
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
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>Edit Profile</H1>
          </View>
        </Header>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: 10,
            backgroundColor: 'white'
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
              <Label>First Name</Label>
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
                paddingLeft: 10
              }}
            >
              <Label>Last Name</Label>
              <Input
                value={this.state.lastName}
                onChangeText={text => this.onChangeLastName(text)}
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
              <Label>Email</Label>
              <Input
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
                paddingLeft: 10
              }}
            >
              <Label>Phone Number</Label>
              <Input
                keyboardType="phone-pad"
                value={this.state.phoneNumber}
                onChangeText={text => this.onChangePhoneNumber(text)}
              />
            </Item>
          </Form>
          <Button
            block
            iconRight
            rounded
            onPress={this.handleSubmit}
            style={{
              margin: 20,
              alignSelf: 'center',
              backgroundColor: '#fc466b'
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Submit</Text>
            <Icon type="MaterialIcons" name="tag-faces" />
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps, { updateCurrentUser })(EditProfile);
