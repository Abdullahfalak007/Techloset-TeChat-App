// src/screens/conversation/useConversation.ts

import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../hooks/useStore';

export interface MessageDoc {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export const useConversation = (conversationId: string) => {
  const {user} = useAppSelector(state => state.auth);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Listen for messages in real-time
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

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
            if (data.timestamp) {
              msgs.push({
                id: doc.id,
                senderId: data.senderId,
                text: data.text,
                timestamp: data.timestamp,
              });
            }
          });
          setMessages(msgs);
          setLoading(false);
        },
        error => {
          console.error('Error fetching conversation messages:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [conversationId]);

  // Send message
  const sendMessage = async () => {
    if (!user?.uid || !inputText.trim()) return;

    // Create a new message
    const newMsg = {
      senderId: user.uid,
      text: inputText.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    const conversationRef = firestore()
      .collection('conversations')
      .doc(conversationId);

    // Add the message doc
    await conversationRef.collection('messages').add(newMsg);

    // Update conversation's lastMessage, updatedAt
    await conversationRef.update({
      lastMessage: inputText.trim(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    setInputText('');
  };

  return {
    user,
    messages,
    inputText,
    setInputText,
    loading,
    sendMessage,
  };
};
