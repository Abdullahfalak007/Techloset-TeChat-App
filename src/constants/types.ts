// src/constants/types.ts
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined; // The bottom tab navigator container
  Conversation: {conversationId: string};
};

export type BottomTabParamList = {
  Messages: undefined; // This will render your ChatList
  Contacts: undefined;
  Settings: undefined;
};

export type AuthState = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
};
