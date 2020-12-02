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
import { StatusBar, View } from 'react-native';
import Card from './card';
import { UserState } from '../../redux/user/types';
import { AppState } from '../../redux/store';
import { connect } from 'react-redux';
import axios from 'axios';
import { REACT_APP_IP_ADDRESS } from '@env';
import { ScrollView } from 'react-native-gesture-handler';

export type card = {
  default: boolean;
  title: string;
  id: string;
};

interface WalletProps {
  user: UserState;
  navigation: any;
}

class Wallet extends Component<WalletProps> {
  state: { loading: boolean; cards: card[] } = {
    loading: false,
    cards: []
  };

  componentDidMount = () => {
    this.props.navigation.addListener('focus', async () => {
      this.setState({ loading: true });
      const cards: card[] = await this.getAllCards();
      this.setState({ loading: false, cards: cards });
    });
  };

  getAllCards = async () => {
    const resp: any = await axios
      .get(`http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/getCustomer`, {
        headers: { sessionId: this.props.user.sessionId }
      })
      .catch(e => {
        console.log(e.message);
      });
    const resp2 = await axios.get(
      `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/getCards`,
      {
        headers: { sessionId: this.props.user.sessionId }
      }
    );
    const stripeCards: any[] = resp2.data.data.data;
    const cards: any[] = [];
    if (stripeCards.length > 0) {
      stripeCards.map((card: any) => {
        const newCard: card = {
          default: card.id === resp.data.data.default_source,
          title: card.brand + ' - ' + card.last4,
          id: card.id
        };
        cards.push(newCard);
      });
    }
    return cards;
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
          <H1 style={{ fontWeight: 'bold', color: 'white' }}>My Wallet</H1>
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
                  this.state.cards.length === 0 ? 'center' : 'flex-start',
                flex: 1
              }}
            >
              {this.state.cards.length > 0 ? (
                <List>
                  <ScrollView>
                    {this.state.cards.map((card, i) => (
                      <Card
                        token={this.props.user.sessionId}
                        key={i}
                        card={card}
                        handleDelete={(deletedId: any) => {
                          this.setState({ loading: true });
                          const cards = this.state.cards.filter(
                            card => card.id !== deletedId
                          );
                          this.setState({ loading: false, cards: cards });
                        }}
                        handleUpdate={async () => {
                          this.setState({ loading: true });
                          const cards: card[] = await this.getAllCards();
                          this.setState({ loading: false, cards: cards });
                        }}
                      />
                    ))}
                  </ScrollView>
                </List>
              ) : (
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  No card data!
                </Text>
              )}
            </View>
          )}
          {!this.state.loading && (
            <Button
              iconRight
              block
              style={{
                backgroundColor: '#48C9B0',
                elevation: 10
              }}
              rounded
              onPress={() => this.props.navigation.push('Add')}
            >
              <Text>Add a payment method</Text>
              <Icon name="credit-card" type="FontAwesome" />
            </Button>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user
});

export default connect(mapStateToProps)(Wallet);
