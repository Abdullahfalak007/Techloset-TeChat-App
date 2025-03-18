// src/screens/messages/useMessages.ts

import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../hooks/useStore';

// Conversation item
export interface ConversationItem {
  id: string;
  lastMessage: string;
  updatedAt: any;
  participants: string[];
}

export const useMessages = () => {
  const {user} = useAppSelector(state => state.auth);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Listen to all conversation docs where user is a participant
    const unsubscribe = firestore()
      .collection('conversations')
      .where('participants', 'array-contains', user.uid)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            setConversations([]);
            setLoading(false);
            return;
          }
          const convs: ConversationItem[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            convs.push({
              id: doc.id,
              lastMessage: data.lastMessage || '',
              updatedAt: data.updatedAt,
              participants: data.participants || [],
            });
          });
          setConversations(convs);
          setLoading(false);
        },
        error => {
          console.error('Error fetching conversations:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.uid]);

  return {conversations, loading};
};
