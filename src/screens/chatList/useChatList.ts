import {useState} from 'react';
import {Keyboard} from 'react-native';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList, MainStackParamList} from '../../constants/types';
import {deleteConversation} from '../../store/slices/chatSlice';
import {useConversationListener} from '../../hooks/useConversationListener';

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: any;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>;
};

/** Convert a Firestore timestamp into a relative time string */
export function timeAgo(updatedAt: any): string {
  if (!updatedAt) return '';
  const date = updatedAt.toDate ? updatedAt.toDate() : new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export const useChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
        NativeStackNavigationProp<MainStackParamList>
      >
    >();

  // Listen for conversation changes using the global hook.
  useConversationListener(user?.uid);

  // Additional UI state.
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchPress = () => {
    setSearchActive(prev => !prev);
    if (searchActive) {
      setSearchTerm('');
    }
  };

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Conversation', {conversationId});
  };

  const handleDeleteConversation = (conversationId: string) => {
    dispatch(deleteConversation({conversationId}));
  };

  const dismissKeyboard = () => {
    if (searchActive) {
      setSearchActive(false);
      setSearchTerm('');
      Keyboard.dismiss();
    }
  };

  const filteredConversations = searchTerm
    ? conversations.filter(conv =>
        conv.recipientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : conversations;

  return {
    user,
    loading,
    conversations: filteredConversations,
    searchActive,
    setSearchActive,
    searchTerm,
    setSearchTerm,
    handleSearchPress,
    handleOpenConversation,
    handleDeleteConversation,
    dismissKeyboard,
    navigation,
    timeAgo,
  };
};
