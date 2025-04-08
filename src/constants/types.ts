import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Conversation: {conversationId: string};
  Profile: undefined;
  ChangePassword: undefined;
};

export type BottomTabParamList = {
  Messages: undefined;
  Contacts: undefined;
  Settings: undefined;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  ChangePassword: undefined;
};

export type BackButtonProps = {
  onPress?: () => void;
};

export type Contact = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
  status?: string;
};

export type ContactItemProps = {
  contact: Contact;
  showAddButton: boolean;
  isAdding: boolean;
  onAddPress: (uid: string) => void;
};

export type ConversationHeaderProps = {
  conversationId: string;
  onBackPress?: () => void;
};

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: FirebaseFirestoreTypes.Timestamp | Date | number;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>;
};

export type ConversationItemProps = {
  conversation: ConversationDoc;
  userId: string;
  onPress: () => void;
  onDelete: () => void;
  timeAgo: (
    updatedAt: FirebaseFirestoreTypes.Timestamp | Date | number,
  ) => string;
  isDeleting: boolean;
};

export type DividerProps = {
  lineColor?: string;
  orTextColor?: string;
};

export type EditableAvatarProps = {
  avatarSource: string;
  onEdit: () => void;
};

export type GoogleButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean;
};

export type GradientButtonProps = {
  onPress: () => void;
  text?: string;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
};

export type GradientHeaderProps = {
  title: string;
  isContactsScreen?: boolean;
  onSearchPress?: () => void;
  onAddPress?: () => void;
  avatarUri?: string | null;
  searchActive?: boolean;
  searchValue?: string;
  onChangeSearch?: (text: string) => void;
  isScreenWithBackArrow?: boolean;
  onBackPress?: () => void;
};

export type InputBarProps = {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  handleAttach: () => void;
  handleCamera: () => void;
};

export type MessageItemProps = {
  item: {
    id: string;
    senderId: string;
    text: string;
    type?: 'text' | 'image';
    timestamp: FirebaseFirestoreTypes.Timestamp | Date | number;
  };
  index: number;
  section: {title: string; data: readonly Message[]};
  isOwnMessage: boolean;
  senderAvatar: ImageSourcePropType; // Update type here
  senderName: string;
  timestamp: FirebaseFirestoreTypes.Timestamp | Date | number;
  formatTime: (
    timestamp: FirebaseFirestoreTypes.Timestamp | Date | number,
  ) => string;
};

export type SettingsMenuItemProps = {
  item: {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
  };
  onPress: () => void;
};

export type UserAvatarProps = {
  source: string | number;
  style?: StyleProp<ImageStyle>;
};

export type AuthNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Auth'
>;

export type ConversationRouteProp = RouteProp<
  MainStackParamList,
  'Conversation'
>;

export type ForgotPasswordNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

export type User = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  status: string | null;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: FirebaseFirestoreTypes.Timestamp | Date | number;
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>;
};

export type ChatState = {
  loading: boolean;
  error: string | null;
  conversations: Conversation[];
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: FirebaseFirestoreTypes.Timestamp | Date | number;
  type?: 'text' | 'image';
  mimeType?: string;
};

export type MessageSection = {
  title: string;
  data: Message[];
};

export type InputFieldProps = {
  label: string;
  error?: string;
} & TextInputProps & {
    containerStyle?: object;
    labelStyle?: object;
    inputStyle?: object;
    errorTextStyle?: object;
  };

export type LoaderProps = {
  style?: StyleProp<ImageStyle>;
};

export type UpdateButtonProps = {
  onPress: () => void;
  text: string;
  loading?: boolean;
};
