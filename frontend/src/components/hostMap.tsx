import React, { Component } from 'react';
import { AppState } from '../redux/store';
import { connect } from 'react-redux';
import {
  StyleSheet,
  StatusBar,
  View,
  PermissionsAndroid,
  Alert,
  Platform,
  PermissionStatus
} from 'react-native';
import { updateSession } from '../redux/system/actions';
import { updateCurrentUser } from '../redux/user/actions';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Container, Content, Icon, Button, Spinner } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY } from '@env';
import Geolocation from 'react-native-geolocation-service';

interface HostMapProps {
  navigation: any;
}

class HostMap extends Component<HostMapProps> {
  state = {
    loading: true,
    latitude: 42.023949,
    longitude: -93.647595,
    searchLat: 0,
    searchLong: 0,
    searched: false,
    listings: []
  };

  componentDidMount = async () => {
    let granted: PermissionStatus = PermissionsAndroid.RESULTS.GRANTED;
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
    if (
      granted === PermissionsAndroid.RESULTS.GRANTED ||
      Platform.OS === 'ios'
    ) {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          Alert.alert('Location failure :(', error.message);
          console.log(error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    }
    this.setState({ loading: false });
  };

  findMe = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          searched: false
        });
      },
      error => {
        Alert.alert('Location failure :(', error.message);
        console.log(error.message);
      }
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          translucent
          barStyle="dark-content"
        />
        <Content
          contentContainerStyle={{
            justifyContent: 'center',
            flex: 1
          }}
        >
          {this.state.loading ? (
            <Spinner />
          ) : (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                showsCompass={true}
                region={{
                  latitude: this.state.searched
                    ? this.state.searchLat
                    : this.state.latitude,
                  longitude: this.state.searched
                    ? this.state.searchLong
                    : this.state.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
                loadingEnabled
                onMapReady={this.findMe}
              >
                <Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                  }}
                  pinColor={'#48C9B0'}
                  title="Your current location"
                />
                {this.state.searched && (
                  <Marker
                    coordinate={{
                      latitude: this.state.searchLat,
                      longitude: this.state.searchLong
                    }}
                    pinColor={'#5DADE2'}
                    title="Your desired location"
                  />
                )}
              </MapView>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  left: 0,
                  margin: 40,
                  borderRadius: 30,
                  backgroundColor: '#34495E',
                  padding: 5,
                  elevation: 50
                }}
              >
                <GooglePlacesAutocomplete
                  styles={{
                    textInputContainer: {
                      borderRadius: 30,
                      backgroundColor: 'white'
                    },
                    textInput: { backgroundColor: 'white', borderRadius: 30 },
                    description: { color: 'white' }
                  }}
                  onPress={(data, details = null) => {
                    //var x = data.description.split(',');
                    const temp: any = details;
                    this.setState({
                      searchLat: temp.geometry.location.lat,
                      searchLong: temp.geometry.location.lng,
                      searched: true
                    });
                    this.props.navigation.navigate('AllListings', {
                      mode: 'search',
                      latitude: temp.geometry.location.lat,
                      longitude: temp.geometry.location.lng
                    });
                  }}
                  fetchDetails={true}
                  minLength={1}
                  onFail={error => console.error(error)}
                  placeholder="Where would you like to go?"
                  query={{
                    key: REACT_APP_GOOGLE_API_KEY,
                    language: 'en',
                    components: 'country:us'
                  }}
                  enablePoweredByContainer={false}
                />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  margin: 40,
                  marginLeft: 20,
                  marginRight: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <Button
                  icon
                  rounded
                  onPress={this.props.navigation.openDrawer}
                  style={{
                    marginRight: 10,
                    elevation: 30,
                    backgroundColor: '#34495E',
                    alignSelf: 'center'
                  }}
                >
                  <Icon
                    style={{ fontSize: 21 }}
                    type="AntDesign"
                    name="menufold"
                  />
                </Button>
                <Button
                  icon
                  rounded
                  onPress={this.findMe}
                  style={{
                    marginRight: 10,
                    elevation: 30,
                    backgroundColor: '#C0392B',
                    alignSelf: 'center'
                  }}
                >
                  <Icon
                    style={{ fontSize: 21 }}
                    type="MaterialIcons"
                    name="my-location"
                  />
                </Button>
              </View>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#34495E'
  },
  map: {
    justifyContent: 'center',
    flex: 1
  }
});

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  system: state.system
});

export default connect(mapStateToProps, { updateSession, updateCurrentUser })(
  HostMap
);
