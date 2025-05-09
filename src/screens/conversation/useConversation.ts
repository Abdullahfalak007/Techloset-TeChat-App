import {useState, useEffect, useRef} from 'react';
import {
  SectionList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {sendMessage} from '../../store/slices/chatSlice';
import {useImagePicker} from '../../utils/useImagePicker';
import {Message, MessageSection, Conversation} from '../../constants/types';
import {groupMessagesByDay} from '../../utils/chatUtils';
import {DocumentData} from '@firebase/firestore-types';

export interface UseConversationLogicReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  sectionListRef: React.RefObject<SectionList<Message, {title: string}>> | null;
  conversation: Conversation | undefined;
  sections: MessageSection[];
  handleAttach: () => Promise<void>;
  handleCamera: () => Promise<void>;
  handleSend: () => Promise<void>;
  formatTime: (
    timestamp: FirebaseFirestoreTypes.Timestamp | Date | number | undefined,
  ) => string;

  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  showScrollDown: boolean;
  scrollToBottom: () => void;
}

export function useConversationLogic(
  conversationId: string,
): UseConversationLogicReturn {
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const {pickImage, captureImage} = useImagePicker();
  const [loading, setLoading] = useState(true);
  const sectionListRef = useRef<SectionList<Message, {title: string}>>(null!);

  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  const [showScrollDown, setShowScrollDown] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setShowScrollDown(!isAtBottom);
  };

  const scrollToBottom = () => {
    sectionListRef
      .current!.getScrollResponder()
      ?.scrollToEnd({animated: false});
  };

  const sections: MessageSection[] = groupMessagesByDay(messages);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        snapshot => {
          const msgs: Message[] = [];
          snapshot.forEach(doc => {
            const data = doc.data() as DocumentData;
            msgs.push({
              id: doc.id,
              senderId: data.senderId,
              text: data.text,
              type: data.type ?? 'text',
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

  useEffect(() => {
    if (!conversationId || !user?.uid) return;
    const docRef = firestore().collection('conversations').doc(conversationId);
    const resetUnreadIfNeeded = async () => {
      try {
        const convSnap = await docRef.get();
        if (!convSnap.exists) return;
        const convData = (convSnap?.data() || {}) as DocumentData;
        const existingUnread: Record<string, number> =
          convData.unreadCounts || {};
        if (existingUnread[user?.uid] && existingUnread[user?.uid] > 0) {
          existingUnread[user?.uid] = 0;
          await docRef.update({unreadCounts: existingUnread});
        }
      } catch (err) {
        console.error('Error resetting unread:', err);
      }
    };
    resetUnreadIfNeeded();
  }, [conversationId, user?.uid]);

  useEffect(() => {
    setTimeout(() => {
      sectionListRef.current
        ?.getScrollResponder()
        ?.scrollToEnd({animated: true});
    }, 300);
  }, [messages]);

  const handleAttach = async (): Promise<void> => {
    try {
      const asset = await pickImage({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (!asset || !asset.base64 || !user?.uid) return;
      await dispatch(
        sendMessage({
          conversationId,
          senderId: user.uid,
          text: asset.base64,
          type: 'image',
        }),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error picking image:', err.message);
      } else {
        console.error('Error picking image:', err);
      }
    }
  };

  const handleCamera = async (): Promise<void> => {
    try {
      const asset = await captureImage({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (!asset || !asset.base64 || !user?.uid) return;
      await dispatch(
        sendMessage({
          conversationId,
          senderId: user.uid,
          text: asset.base64,
          type: 'image',
        }),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error capturing image:', err.message);
      } else {
        console.error('Error capturing image:', err);
      }
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!inputText.trim() || !user?.uid) return;
    try {
      await dispatch(
        sendMessage({
          conversationId,
          senderId: user?.uid,
          text: inputText.trim(),
          type: 'text',
        }),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error sending message:', err.message);
      } else {
        console.error('Error sending message:', err);
      }
    }
    setInputText('');
  };

  const formatTime = (
    timestamp: FirebaseFirestoreTypes.Timestamp | Date | number | undefined,
  ): string => {
    const date =
      timestamp instanceof FirebaseFirestoreTypes.Timestamp
        ? timestamp.toDate()
        : timestamp instanceof Date
        ? timestamp
        : new Date(timestamp ?? Date.now());

    return date
      .toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toUpperCase();
  };

  return {
    messages,
    setMessages,
    inputText,
    setInputText,
    loading,
    sectionListRef,
    conversation,
    sections,
    handleAttach,
    handleCamera,
    handleSend,
    formatTime,
    handleScroll,
    showScrollDown,
    scrollToBottom,
  };
}
