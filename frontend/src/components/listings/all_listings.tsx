import React, { Component } from 'react';
import {
  Button,
  Container,
  Content,
  H1,
  Header,
  Icon,
  List,
  Spinner,
  Text
} from 'native-base';
import { StatusBar } from 'react-native';
import Listing from '../listings/listing';
import Axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';
import { ScrollView } from 'react-native-gesture-handler';

interface GetListingsProps {
  navigation: any;
  route: any;
}

export default class GetListings extends Component<GetListingsProps> {
  state = {
    loading: false,
    listings: []
  };

  componentDidMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      this.setState({ loading: true });
      await this.fetchListings();
      this.setState({ loading: false });
    });
  };

  getListings = async (lat: any, long: any) => {
    await Axios.get(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/listings/getListingsByLocation?long=${long}&lat=${lat}&maxMiles=10`
    ).then(resp => {
      let temp = resp.data.data;
      this.setState({ listings: temp });
    });
  };

  fetchListings = async () => {
    if (this.props.route.params.mode === 'search') {
      await this.getListings(
        this.props.route.params.latitude,
        this.props.route.params.longitude
      );
    } else {
      Axios.get(`http://${REACT_APP_IP_ADDRESS}:8080/api/listings`).then(
        resp => {
          let temp = resp.data.data;
          this.setState({ listings: temp });
        }
      );
    }
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
          <H1 style={{ fontWeight: 'bold', color: 'white' }}>
            Available Listings
          </H1>
        </Header>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="light-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent:
              this.state.loading || this.state.listings.length === 0
                ? 'center'
                : 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
          }}
        >
          {this.state.loading ? (
            <Spinner />
          ) : this.state.listings.length > 0 ? (
            <List>
              <ScrollView>
                {this.state.listings.map((listing: any, i) => (
                  <Listing
                    myListings={false}
                    key={i}
                    id={listing.id}
                    street={listing.address.street}
                    city={listing.address.city}
                    state={listing.address.state}
                    zipCode={listing.address.zipCode}
                    numSpots={listing.numSpots}
                    price={listing.price}
                    startDate={listing.startDate}
                    endDate={listing.endDate}
                  />
                ))}
              </ScrollView>
            </List>
          ) : (
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
              No available listings :(
            </Text>
          )}
        </Content>
      </Container>
    );
  }
}
