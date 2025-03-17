// src/screens/conversation/useConversation.ts
import {useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {useAppSelector} from '../../hooks/useStore';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export const useConversation = (conversationId: string) => {
  const {user} = useAppSelector(state => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!conversationId) return;
    const messagesRef = database().ref(
      `/conversations/${conversationId}/messages`,
    );
    const onValueChange = messagesRef.on(
      'value',
      (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
        if (!snapshot.exists()) {
          setMessages([]);
          return;
        }
        const data = snapshot.val();
        const msgArray: Message[] = Object.keys(data).map(msgId => ({
          id: msgId,
          senderId: data[msgId].senderId,
          text: data[msgId].text,
          timestamp: data[msgId].timestamp,
        }));
        msgArray.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgArray);
      },
    );

    return () => messagesRef.off('value', onValueChange);
  }, [conversationId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !user?.uid) return;
    const newMessageRef = database()
      .ref(`/conversations/${conversationId}/messages`)
      .push();
    await newMessageRef.set({
      senderId: user.uid,
      text: inputText.trim(),
      timestamp: Date.now(),
    });
    setInputText('');
  };

  return {messages, inputText, setInputText, sendMessage};
};
