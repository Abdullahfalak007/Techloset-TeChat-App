// src/screens/chatList/ChatList.tsx
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {listenToUserConversations} from '../../store/slices/chatSlice';
import {COLORS} from '../../constants/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';

type ChatListNavigationProp = StackNavigationProp<
  MainStackParamList,
  'ChatListScreen'
>;

const ChatList = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ChatListNavigationProp>();
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);

  useEffect(() => {
    if (user?.uid) {
      dispatch(listenToUserConversations({uid: user.uid}));
    }
  }, [dispatch, user?.uid]);

  const handleOpenConversation = (convId: string) => {
    navigation.navigate('Conversation', {conversationId: convId});
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleOpenConversation(item.id)}>
      <Text style={styles.convTitle}>Conversation: {item.id}</Text>
      <Text style={styles.lastMessage}>
        {item.lastMessage || 'No messages yet'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
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
  itemContainer: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  convTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textColor,
    marginTop: 4,
  },
});
