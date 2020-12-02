import React, { Component } from 'react';
import {
  Button,
  Container,
  Content,
  H1,
  H2,
  Header,
  Icon,
  List,
  ListItem,
  Thumbnail,
  Text as NBText
} from 'native-base';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { StatusBar, View, Text } from 'react-native';
import { SystemState } from '../../redux/system/types';

interface ProfileProps {
  user: UserState;
  system: SystemState;
  navigation: any;
}

class Profile extends Component<ProfileProps> {
  render() {
    return (
      <Container style={{ backgroundColor: '#34495E' }}>
        <Header
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: 'transparent',
            marginBottom: 10,
            marginTop: 30,
            elevation: 0
          }}
          iosBarStyle="light-content"
        >
          <Button
            transparent
            onPress={() => this.props.navigation.navigate('Map')}
          >
            <Icon name="arrow-back" type="MaterialIcons" />
          </Button>
          <H1 style={{ fontWeight: 'bold', color: 'white' }}>My Profile</H1>
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
          <View>
            <View>
              <Thumbnail
                large
                style={{
                  backgroundColor: 'lightblue',
                  marginRight: 10,
                  borderColor: '#6FFFB0',
                  borderWidth: 3,
                  alignSelf: 'center'
                }}
                source={{
                  uri:
                    'https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png'
                }}
              />
              <H1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {this.props.user.fullName}
              </H1>
              <H2 style={{ textAlign: 'center' }}>
                {this.props.user.host ? 'Host' : 'Driver'}
              </H2>
            </View>
            <List>
              <ListItem>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex'
                  }}
                >
                  <Text
                    style={{
                      color: '#34495E',
                      fontWeight: 'bold',
                      fontSize: 24,
                      textAlign: 'left'
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      color: '#34495E',
                      fontSize: 18,
                      textAlign: 'left'
                    }}
                  >
                    {this.props.user.email}
                  </Text>
                </View>
              </ListItem>
              <ListItem>
                <View>
                  <Text
                    style={{
                      color: '#34495E',
                      fontWeight: 'bold',
                      marginRight: 0,
                      fontSize: 24,
                      textAlign: 'left'
                    }}
                  >
                    Phone number
                  </Text>
                  <Text
                    style={{
                      color: '#34495E',
                      fontSize: 18,
                      textAlign: 'left'
                    }}
                  >
                    {this.props.user.phoneNumber}
                  </Text>
                </View>
              </ListItem>
            </List>
          </View>
          <Button
            iconRight
            block
            style={{
              backgroundColor: '#48C9B0',
              elevation: 10
            }}
            rounded
            onPress={() => this.props.navigation.push('Edit')}
          >
            <NBText>Edit Profile</NBText>
            <Icon name="edit" type="FontAwesome" />
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  system: state.system
});

export default connect(mapStateToProps)(Profile);
