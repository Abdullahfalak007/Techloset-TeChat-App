// src/screens/messages/useMessages.ts
import {useEffect, useState} from 'react';
import {useAppSelector} from '../../hooks/useStore';

type ChatItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar?: string;
};

export const useMessages = () => {
  const {user, loading} = useAppSelector(state => state.auth);
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);

  useEffect(() => {
    // Dummy data for demonstration
    setChatItems([
      {
        id: '1',
        name: 'John Borino',
        message: 'Have a good day 🌸',
        time: '2 min ago',
        avatar: 'https://i.pravatar.cc/100?img=11',
      },
      {
        id: '2',
        name: 'Angel Dayna',
        message: 'How are you today?',
        time: '2 min ago',
        avatar: 'https://i.pravatar.cc/100?img=12',
      },
      // ...
    ]);
  }, []);

  return {
    user,
    loading,
    chatItems,
  };
};
