// src/screens/conversation/Conversation.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {MainStackParamList} from '../../constants/types';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../hooks/useStore';
import {COLORS} from '../../constants/colors';

type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

interface MessageDoc {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore timestamp
}

const Conversation = () => {
  const route = useRoute<ConversationRouteProp>();
  const {conversationId} = route.params;
  const {user} = useAppSelector(state => state.auth);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        snapshot => {
          const msgs: MessageDoc[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            msgs.push({
              id: doc.id,
              senderId: data.senderId,
              text: data.text,
              timestamp: data.timestamp,
            });
          });
          setMessages(msgs);
          setLoading(false);
        },
        error => {
          console.error('Error fetching messages:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [conversationId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user?.uid) return;
    await firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .add({
        senderId: user.uid,
        text: inputText.trim(),
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    // Update conversation's lastMessage and updatedAt
    await firestore().collection('conversations').doc(conversationId).update({
      lastMessage: inputText.trim(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    setInputText('');
  };

  const renderItem = ({item}: {item: MessageDoc}) => {
    const isOwnMessage = item.senderId === user?.uid;
    return (
      <View
        style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {item.timestamp
            ? new Date(item.timestamp.toDate()).toLocaleTimeString()
            : ''}
        </Text>
      </View>
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
    <View style={styles.container}>
      <Text style={styles.conversationTitle}>
        Conversation: {conversationId}
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
  container: {flex: 1, backgroundColor: COLORS.white},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    padding: 10,
  },
  messageList: {flex: 1, paddingHorizontal: 10},
  messageContainer: {
    backgroundColor: '#eee',
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  ownMessage: {backgroundColor: COLORS.gradientStart, alignSelf: 'flex-end'},
  messageText: {color: COLORS.black, fontSize: 14},
  messageTime: {color: '#888', fontSize: 10, marginTop: 2, textAlign: 'right'},
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
  sendButtonText: {color: COLORS.white, fontWeight: 'bold'},
});
