// src/screens/conversation/Conversation.tsx
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {MainStackParamList} from '../../constants/types';
import {listenToConversation, sendMessage} from '../../store/slices/chatSlice';
import {COLORS} from '../../constants/colors';

type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

const Conversation = () => {
  const route = useRoute<ConversationRouteProp>();
  const {conversationId} = route.params;
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
  const {messages, activeConversationId} = useAppSelector(state => state.chat);

  const [inputText, setInputText] = React.useState('');

  useEffect(() => {
    if (conversationId && user?.uid) {
      dispatch(listenToConversation({conversationId, userUid: user.uid}));
    }
  }, [dispatch, conversationId, user?.uid]);

  const handleSend = () => {
    if (!user?.uid) return;
    dispatch(
      sendMessage({conversationId, senderId: user.uid, text: inputText}),
    );
    setInputText('');
  };

  const renderItem = ({item}: any) => {
    const isOwnMessage = item.senderId === user?.uid;
    return (
      <View
        style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.conversationTitle}>
        Conversation: {activeConversationId}
      </Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    padding: 10,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    backgroundColor: '#eee',
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  ownMessage: {
    backgroundColor: COLORS.gradientStart,
    alignSelf: 'flex-end',
  },
  messageText: {
    color: COLORS.black,
    fontSize: 14,
  },
  messageTime: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  sendButton: {
    backgroundColor: COLORS.gradientEnd,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 4,
  },
  sendButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
