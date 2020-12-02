import { createStore, combineReducers } from 'redux';
import { userReducer } from './user/reducers';
import { systemReducer } from './system/reducers';

const rootReducer = combineReducers({
  user: userReducer,
  system: systemReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer);

  return store;
}
