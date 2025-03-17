import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined; // The bottom tab navigator
  ChatListScreen: undefined;
  Conversation: {conversationId: string};
  BottomTabs: undefined;
};

export type BottomTabParamList = {
  Messages: undefined;
  Contacts: undefined;
  Settings: undefined;
};

export type AuthState = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
};
