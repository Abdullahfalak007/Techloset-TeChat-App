import {useState, useEffect, useRef} from 'react';
import {
  SectionList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {sendMessage} from '../../store/slices/chatSlice';
import {useImagePicker} from '../../utils/useImagePicker';
import {Message, MessageSection} from '../../constants/types';
import {groupMessagesByDay} from '../../utils/chatUtils';

export function useConversationLogic(conversationId: string) {
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const {pickImage, captureImage} = useImagePicker();
  const [loading, setLoading] = useState(true);
  const sectionListRef = useRef<SectionList<Message, {title: string}>>(null);

  // Read conversation details from the store.
  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  // State to control the visibility of the scroll down button.
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Handler to check if the user is near the bottom of the list.
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setShowScrollDown(!isAtBottom);
  };

  const scrollToBottom = () => {
    sectionListRef.current?.getScrollResponder()?.scrollToEnd({animated: true});
  };

  // Group messages into sections by day.
  const sections: MessageSection[] = groupMessagesByDay(messages);

  // Subscribe to real-time updates from Firebase.
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
            const data = doc.data();
            msgs.push({
              id: doc.id,
              senderId: data.senderId,
              text: data.text,
              type: data.type || 'text',
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

  // Reset unread counts when the conversation is opened.
  useEffect(() => {
    if (!conversationId || !user?.uid) return;
    const docRef = firestore().collection('conversations').doc(conversationId);
    const resetUnreadIfNeeded = async () => {
      try {
        const convSnap = await docRef.get();
        if (!convSnap.exists) return;
        const convData = convSnap.data() || {};
        const existingUnread: Record<string, number> =
          convData.unreadCounts || {};
        if (existingUnread[user.uid] && existingUnread[user.uid] > 0) {
          existingUnread[user.uid] = 0;
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

  // Handle button click: Pick an image from the library using the reusable hook.
  const handleAttach = async () => {
    try {
      const asset = await pickImage({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (!asset || !asset.base64 || !user?.uid) return;
      dispatch(
        sendMessage({
          conversationId,
          senderId: user.uid,
          text: asset.base64,
          type: 'image',
        }),
      );
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  // Handle button click: Capture an image using the camera via the reusable hook.
  const handleCamera = async () => {
    try {
      const asset = await captureImage({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (!asset || !asset.base64 || !user?.uid) return;
      dispatch(
        sendMessage({
          conversationId,
          senderId: user.uid,
          text: asset.base64,
          type: 'image',
        }),
      );
    } catch (err) {
      console.error('Error capturing image:', err);
    }
  };

  // Handle button click: Send a text message.
  const handleSend = async () => {
    if (!inputText.trim() || !user?.uid) return;
    try {
      await dispatch(
        sendMessage({
          conversationId,
          senderId: user.uid,
          text: inputText.trim(),
          type: 'text',
        }),
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setInputText('');
  };

  // Helper to format the timestamp for display.
  const formatTime = (timestamp: any) => {
    const time =
      timestamp && typeof timestamp.toDate === 'function'
        ? timestamp.toDate()
        : timestamp
        ? new Date(timestamp)
        : new Date();
    return time
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
