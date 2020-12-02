import React, { Component } from 'react';
import { View, StatusBar, Alert } from 'react-native';
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
  Header,
  DatePicker
} from 'native-base';
import Axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';
import { UserState } from '../../redux/user/types';
import { connect } from 'react-redux';
import { AppState } from 'src/redux/store';
import { ScrollView } from 'react-native-gesture-handler';

interface EditListingProps {
  navigation: any;
  route: any;
  user: UserState;
}

class EditListing extends Component<EditListingProps> {
  state = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    numSpots: '',
    ogNumSpots: '',
    price: '',
    startDate: new Date(),
    endDate: new Date()
  };

  componentDidMount = async () => {
    const resp = await Axios.get(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/listings/getListing/${this.props.route.params.id}`
    );

    const listing: any = resp.data.data;
    const sd: string = resp.data.data.startDate;
    const ed: string = resp.data.data.endDate;
    // const sdM: number = +sd.substring(5, 7);
    // const sdD: number = +sd.substring(8, 10);
    // const sdY: number = +sd.substring(0, 4);
    // const edM: number = +ed.substring(5, 7);
    // const edD: number = +ed.substring(8, 10);
    // const edY: number = +ed.substring(0, 4);
    // const sDate: Date = new Date(sdY, sdM, sdD);
    // const eDate: Date = new Date(edY, edM, edD);
    // console.log(sDate);
    // console.log(eDate);

    this.setState({
      street: listing.address.street,
      city: listing.address.city,
      state: listing.address.state,
      zipCode: listing.address.zipCode,
      price: listing.price.$numberDecimal,
      startDate: new Date(sd),
      endDate: new Date(ed),
      numSpots: listing.numSpots.toString() || '0',
      ogNumSpots: listing.numSpots.toString() || '0'
    });
  };

  onChangeStreet = (text: string) => {
    this.setState({
      street: text
    });
  };

  onChangeCity = (text: string) => {
    this.setState({
      city: text
    });
  };

  onChangeState = (text: string) => {
    this.setState({
      state: text
    });
  };

  onChangeZipCode = (text: string) => {
    this.setState({
      zipCode: text
    });
  };

  onChangeNumSpots = (text: string) => {
    this.setState({
      numSpots: text
    });
  };

  onChangeNumPrice = (text: string) => {
    this.setState({
      price: text
    });
  };
  onChangeStartDate = (text: string) => {
    console.log(text);
    this.setState({
      startDate: text
    });
  };

  onChangeEndDate = (text: string) => {
    console.log(text);
    this.setState({
      endDate: text
    });
  };

  handleUpdate = async () => {
    await Axios.put(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/listings/editSpots`,
      {
        addSpots: true,
        amount: +this.state.numSpots - +this.state.ogNumSpots
      },
      { headers: { sessionId: this.props.user.sessionId } }
    )
      .then(() => {
        Alert.alert(
          'Update Successful!',
          'You just updated the number of spots available for your listing!'
        );
        this.props.navigation.popToTop();
      })
      .catch(() =>
        Alert.alert(
          'Update failure :(',
          "We couldn't update your listing at this moment :("
        )
      );
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
            <H1 style={{ fontWeight: 'bold', color: 'white' }}>Edit Listing</H1>
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
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 10
          }}
        >
          <ScrollView>
            <Form>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Street Name</Label>
                <Input
                  disabled
                  value={this.state.street}
                  onChangeText={text => this.onChangeStreet(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>City</Label>
                <Input
                  disabled
                  value={this.state.city}
                  onChangeText={text => this.onChangeCity(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>State</Label>
                <Input
                  disabled
                  value={this.state.state}
                  onChangeText={text => this.onChangeState(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Zip Code</Label>
                <Input
                  disabled
                  keyboardType="numeric"
                  value={this.state.zipCode}
                  onChangeText={value => {
                    if (value.length <= 5) {
                      this.onChangeZipCode(value);
                    }
                  }}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label style={{ fontWeight: 'bold' }}>
                  NUMBER OF SPOTS AVAILABLE
                </Label>
                <Input
                  keyboardType="numeric"
                  value={this.state.numSpots}
                  onChangeText={text => this.onChangeNumSpots(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white'
                }}
              >
                <Label>Price</Label>
                <Input
                  disabled
                  value={this.state.price}
                  onChangeText={text => this.onChangeNumPrice(text)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  alignItems: 'flex-start'
                }}
              >
                <Label>Start Date</Label>
                <DatePicker
                  disabled
                  defaultDate={this.state.startDate}
                  locale={'en'}
                  modalTransparent
                  animationType="slide"
                  onDateChange={date => this.onChangeStartDate(date)}
                />
              </Item>
              <Item
                stackedLabel
                style={{
                  backgroundColor: 'white',
                  flex: 1,
                  alignItems: 'flex-start'
                }}
              >
                <Label>End Date</Label>
                <DatePicker
                  disabled
                  defaultDate={this.state.endDate}
                  locale={'en'}
                  modalTransparent
                  onDateChange={date => this.onChangeEndDate(date)}
                />
              </Item>
            </Form>
            <Button
              block
              iconRight
              rounded
              onPress={this.handleUpdate}
              style={{
                backgroundColor: '#5DADE2',
                margin: 10
              }}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Update</Text>
              <Icon type="Feather" name="refresh-cw" />
            </Button>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(EditListing);
