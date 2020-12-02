import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import Login from './src/components/login';
import configureStore from './src/redux/store';
import { Root } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import signUp from './src/components/login/signUp';
import signIn from './src/components/login/signIn';

//declare var global: { HermesInternal: null | {} };

/**
 * REACT REDUX
 *
 * Store - holds our state - THERE IS ONLY ONE STATE
 *
 * Action - State can be modified using actions - SIMPLE OBJECTS
 *
 * Dispatcher - Action needs to be sent by someone - known as dispatching an action
 *
 * Reducer - receives the action and modifies the state to give us a new state
 *  - pure functions
 *  - only mandatory argument is the 'type'
 *
 * Subscriber - listens for state change to update the UI
 */
const store = configureStore();

const RootStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Root>
          <RootStack.Navigator mode="modal">
            <RootStack.Screen
              name="Main"
              component={Login}
              options={{ headerShown: false }}
            />
            <RootStack.Screen name="Sign Up" component={signUp} />
            <RootStack.Screen name="Sign In" component={signIn} />
          </RootStack.Navigator>
        </Root>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
