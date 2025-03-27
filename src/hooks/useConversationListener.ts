import {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch} from './useStore';
import {setConversations} from '../store/slices/chatSlice';
import {Conversation} from '../constants/types';

export const useConversationListener = (uid: string | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = firestore()
      .collection('conversations')
      .where('participants', 'array-contains', uid)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        async snapshot => {
          if (snapshot.empty) {
            dispatch(setConversations([]));
            return;
          }

          const convs: Conversation[] = await Promise.all(
            snapshot.docs.map(async doc => {
              const data = doc.data();
              const recipientId = data.participants.find(
                (p: string) => p !== uid,
              );
              let recipientName = 'Unknown';
              let recipientPhoto: string | null = null;
              if (recipientId) {
                const userDoc = await firestore()
                  .collection('users')
                  .doc(recipientId)
                  .get();
                if (userDoc.exists) {
                  const userData = userDoc.data();
                  recipientName =
                    userData?.displayName || userData?.email || 'Unknown';
                  recipientPhoto = userData?.photoURL || null;
                }
              }
              return {
                id: doc.id,
                lastMessage: data.lastMessage || '',
                updatedAt: data.updatedAt,
                participants: data.participants,
                recipientName,
                recipientPhoto,
                unreadCounts: data.unreadCounts || {},
              } as Conversation;
            }),
          );

          dispatch(setConversations(convs));
        },
        error => {
          console.error('Error listening to conversations: ', error);
        },
      );

    return () => unsubscribe();
  }, [uid, dispatch]);
};
