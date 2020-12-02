import { UserState, UPDATE_USER } from './types';

export const updateCurrentUser = (updatedUser: UserState) => {
  return {
    type: UPDATE_USER,
    payload: updatedUser
  };
};
