// src/screens/chatList/ChatList.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList, MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {useChatList} from './useChatList';
import {deleteConversation} from '../../store/slices/chatSlice';
import GradientHeader from '../../components/gradientHeader/GradientHeader';

type ChatListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: any;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>;
};

/** Convert a Firestore timestamp -> a relative time string like “2 min ago” */
function timeAgo(updatedAt: any): string {
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

const ChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ChatListNavigationProp>();

  // Listen for conversation changes
  useChatList(user?.uid);

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Conversation', {conversationId});
  };

  const handleDeleteConversation = (conversationId: string) => {
    dispatch(deleteConversation({conversationId}));
  };

  // The swipeable right action for deleting a conversation
  const renderRightActions = (conversationId: string) => (
    <TouchableOpacity
      style={styles.deleteIconContainer}
      onPress={() => handleDeleteConversation(conversationId)}>
      <Image
        source={ICONS.delete}
        style={styles.deleteIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderItem = ({item}: {item: ConversationDoc}) => {
    const unreadCount = item.unreadCounts?.[user?.uid] || 0;
    const lastMessageTime = timeAgo(item.updatedAt);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleOpenConversation(item.id)}>
          {/* Avatar */}
          {item.recipientPhoto ? (
            <Image
              source={{uri: item.recipientPhoto}}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderAvatar} />
          )}

          {/* Text Container: top row => name + time, bottom row => last message + unread */}
          <View style={styles.textWrapper}>
            {/* Top row */}
            <View style={styles.topRow}>
              <Text style={styles.convTitle}>{item.recipientName}</Text>
              <Text style={styles.timeText}>{lastMessageTime}</Text>
            </View>

            {/* Bottom row */}
            <View style={styles.bottomRow}>
              <Text style={styles.lastMessage}>
                {item.lastMessage || 'No messages yet'}
              </Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {/* The gradient header at the top */}
      <GradientHeader
        title="Messages"
        avatarUri={user?.base64Photo ?? user?.photoURL ?? null}
      />

      {/* The rounded container below the header */}
      <View style={styles.roundedContainer}>
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // The container that holds your entire list and has the rounded corners
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20, // overlap the gradient a bit
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    flexShrink: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textColor,
    flexShrink: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.redBackground, // define redBackground in colors.ts
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.redBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    alignSelf: 'center',
  },
  deleteIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
});
