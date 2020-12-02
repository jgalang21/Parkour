export interface UserState {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  host: boolean;
  stripeId?: string;
  vehicles?: any;
  sessionId: string;
  id: string;
}

export const UPDATE_USER = 'UPDATE_USER';

interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: UserState;
}

export type UserActionTypes = UpdateUserAction;
