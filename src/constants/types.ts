import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  Home: undefined;
};

export type AuthState = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
};
