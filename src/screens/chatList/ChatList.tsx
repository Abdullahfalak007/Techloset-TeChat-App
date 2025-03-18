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
import {useAppSelector} from '../../hooks/useStore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList, MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {useChatList} from './useChatList';

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: any;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
};

// Use a composite navigation prop so we can navigate to screens in the MainStack
type ChatListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const ChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);
  const navigation = useNavigation<ChatListNavigationProp>();

  // Set up Firestore listener via our custom hook
  useChatList(user?.uid);

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Conversation', {conversationId});
  };

  const renderItem = ({item}: {item: ConversationDoc}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleOpenConversation(item.id)}>
      <View style={styles.profileContainer}>
        {item.recipientPhoto ? (
          <Image
            source={{uri: item.recipientPhoto}}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderAvatar} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.convTitle}>{item.recipientName}</Text>
          <Text style={styles.lastMessage}>
            {item.lastMessage || 'No messages yet'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  console.log(conversations);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  itemContainer: {padding: 12, borderBottomColor: '#ccc', borderBottomWidth: 1},
  profileContainer: {flexDirection: 'row', alignItems: 'center'},
  profileImage: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  textContainer: {flex: 1},
  convTitle: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
  lastMessage: {fontSize: 14, color: COLORS.textColor, marginTop: 4},
});
