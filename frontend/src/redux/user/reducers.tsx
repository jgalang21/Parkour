import { UserState, UserActionTypes, UPDATE_USER } from './types';

const initialState: UserState = {
  password: '',
  email: '',
  phoneNumber: '',
  fullName: '',
  host: false,
  sessionId: '',
  id:''
};

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};
