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
import Listing from '../listings/listing';
import Axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { AppState } from 'src/redux/store';
import { ScrollView } from 'react-native-gesture-handler';

interface GetListingsProps {
  navigation: any;
  user: UserState;
}
class GetListings extends Component<GetListingsProps> {
  state = {
    loading: false,
    listings: []
  };

  componentDidMount = async () => {
    this.props.navigation.addListener('focus', async () => {
      this.setState({ loading: true });
      let listings: any[] = [];
      await Axios.get(`http://${REACT_APP_IP_ADDRESS}:8080/api/listings`).then(
        resp => {
          const tempListings: any[] = resp.data.data;
          tempListings.map(listing => {
            const temp: any = {
              address: {
                city: listing.address.city,
                state: listing.address.state,
                street: listing.address.street,
                zipCode: listing.address.zipCode
              },
              numSpots: listing.numSpots,
              price: listing.price,
              startDate: listing.startDate,
              endDate: listing.endDate,
              hostId: listing.hostId,
              id: listing._id
            };
            listings.push(temp);
          });
        }
      );
      const sorted: any[] = listings.filter(
        (listing: any) => listing.hostId === this.props.user.id
      );
      this.setState({ loading: false, listings: sorted });
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
          <H1 style={{ fontWeight: 'bold', color: 'white' }}>My Listings</H1>
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
            backgroundColor: 'white'
          }}
        >
          {this.state.loading ? (
            <Spinner />
          ) : (
            <View
              style={{
                justifyContent:
                  this.state.listings.length === 0 ? 'center' : 'flex-start',
                flex: 1
              }}
            >
              {this.state.listings.length > 0 ? (
                <List>
                  <ScrollView>
                    {this.state.listings.map((listing: any, i) => (
                      <Listing
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
                        handleDelete={() => {}}
                        handleUpdate={() => {}}
                        navigation={this.props.navigation}
                        myListings={true}
                      />
                    ))}
                  </ScrollView>
                </List>
              ) : (
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  No listing data!
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

export default connect(mapStateToProps)(GetListings);
