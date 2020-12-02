import { UPDATE_SESSION, SystemState, SystemActionTypes } from './types';
//import { hostMode } from './actions';

const initialState: SystemState = {
  loggedIn: false
};

export const systemReducer = (
  state = initialState,
  action: SystemActionTypes
): SystemState => {
  switch (action.type) {
    case UPDATE_SESSION: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};
