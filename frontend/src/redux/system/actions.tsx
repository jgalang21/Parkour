import { SystemState, UPDATE_SESSION } from './types';

export const updateSession = (newSession: SystemState) => {
  return {
    type: UPDATE_SESSION,
    payload: newSession
  };
};




