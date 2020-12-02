import { REACT_APP_IP_ADDRESS } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { UserState } from 'src/redux/user/types';

export const setAsync = (user: UserState) => {
  AsyncStorage.setItem('id', user.id).then(async () => {
    console.log(await AsyncStorage.getItem('id'));
  });

  AsyncStorage.setItem('sessionId', user.sessionId).then(async () => {
    console.log(await AsyncStorage.getItem('sessionId'));
  });
};

export const getStripe = async (sessionId: string) => {
  let stripeId: string = '';
  await axios
    .get(`http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/`, {
      headers: { sessionId: sessionId }
    })
    .then(async resp => {
      if (resp.data.stripeId) {
        stripeId = resp.data.stripeId;
      } else {
        const resp: any = await axios.post(
          `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/createCustomer`,
          {},
          {
            headers: { sessionId: sessionId }
          }
        );
        await axios.post(
          `http://${REACT_APP_IP_ADDRESS}:8080/api/stripe/addId`,
          { stripeId: resp.data.data.id },
          { headers: { sessionId: sessionId } }
        );
        stripeId = resp.data.data.stripeId;
      }
    })
    .catch(error => {
      console.log('getStripe error: ' + error.message);
    });
  return stripeId;
};

export const getUser = async (sessionId: string) => {
  const userResp = await axios.get(
    `http://${REACT_APP_IP_ADDRESS}:8080/api/users/me`,
    {
      headers: { sessionId: sessionId }
    }
  );
  if (userResp) {
    const stripeId = await getStripe(sessionId);
    const user: UserState = {
      email: userResp.data.data.email,
      password: userResp.data.data.password,
      phoneNumber: userResp.data.data.phoneNumber,
      fullName:
        userResp.data.data.firstName + ' ' + userResp.data.data.lastName,
      host: userResp.data.data.host,
      vehicles: userResp.data.data.vehicles,
      stripeId: stripeId,
      sessionId: sessionId,
      id: userResp.data.data.id
    };

    setAsync(user);
    console.log(user);
    return user;
  } else {
    return null;
  }
};
