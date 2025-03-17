// src/screens/chatList/useChatList.ts
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../hooks/useStore';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';

export interface Conversation {
  id: string;
  lastMessage: string;
}

export const useChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const userConvRef = database().ref(`/userConversations/${user.uid}`);

    const onValueChange = userConvRef.on(
      'value',
      (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
        if (!snapshot.exists()) {
          setConversations([]);
          setLoading(false);
          return;
        }
        const data = snapshot.val(); // e.g. { conv1: true, conv2: true, ... }
        const convIds = Object.keys(data);

        const fetchLastMessages = async () => {
          const convArray: Conversation[] = [];
          for (const convId of convIds) {
            const messagesSnap = await database()
              .ref(`/conversations/${convId}/messages`)
              .orderByKey()
              .limitToLast(1)
              .once('value');
            let lastMessage = '';
            messagesSnap.forEach((msg: FirebaseDatabaseTypes.DataSnapshot) => {
              const msgData = msg.val();
              lastMessage = msgData?.text || '';
              return undefined; // Continue iterating
            });
            convArray.push({id: convId, lastMessage});
          }
          setConversations(convArray);
          setLoading(false);
        };

        fetchLastMessages();
      },
    );

    return () => userConvRef.off('value', onValueChange);
  }, [user?.uid]);

  return {conversations, loading};
};
