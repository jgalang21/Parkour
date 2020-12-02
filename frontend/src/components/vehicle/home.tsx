import React, { Component } from 'react';
import {
  Button,
  Container,
  Content,
  H1,
  Header,
  Icon,
  List,
  Right,
  Spinner,
  Text
} from 'native-base';
import { StatusBar, View } from 'react-native';
import Vehicle from './vehicle';
import { AppState } from '../../redux/store';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

interface MyVehiclesProps {
  navigation: any;
  user: UserState;
}

export type vehicle = {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  id: string;
};

class MyVehicles extends Component<MyVehiclesProps> {
  state: { loading: boolean; vehicles: vehicle[] } = {
    loading: false,
    vehicles: []
  };

  componentDidMount = () => {
    this.props.navigation.addListener('focus', () => {
      this.setState({ loading: true });
      let v: vehicle[] = [];
      this.props.user.vehicles.map((vehicle: any) => {
        const temp: vehicle = {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          licensePlate: vehicle.licensePlate,
          color: vehicle.color,
          id: vehicle._id
        };
        v.push(temp);
      });
      this.setState({ loading: false, vehicles: v });
    });
  };

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
          <H1 style={{ fontWeight: 'bold', color: 'white' }}>My Vehicles</H1>
          <Right>
            <Button
              style={{ backgroundColor: 'white' }}
              rounded
              onPress={() => this.props.navigation.push('Add')}
            >
              <Icon
                name="add"
                type="MaterialIcons"
                style={{ fontSize: 32, color: '#48C9B0' }}
              />
            </Button>
          </Right>
        </Header>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent: this.state.loading ? 'center' : 'space-between',
            width: '100%',
            height: '100%',
            padding: 10,
            backgroundColor: 'white'
          }}
        >
          {this.state.loading ? (
            <Spinner />
          ) : (
            <View
              style={{
                justifyContent:
                  this.state.vehicles.length === 0 ? 'center' : 'flex-start',
                flex: 1
              }}
            >
              {this.state.vehicles.length > 0 ? (
                <List>
                  <ScrollView>
                    {this.state.vehicles.map((vehicle, i) => (
                      <Vehicle
                        navigation={this.props.navigation}
                        key={i}
                        v={vehicle}
                      />
                    ))}
                  </ScrollView>
                </List>
              ) : (
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  No vehicle data!
                </Text>
              )}
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(MyVehicles);
