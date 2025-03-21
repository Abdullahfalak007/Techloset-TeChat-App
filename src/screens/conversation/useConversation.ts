import {useState, useEffect, useRef} from 'react';
import {
  SectionList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  launchImageLibrary,
  launchCamera,
  Asset,
} from 'react-native-image-picker';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {sendMessage, Message} from '../../store/slices/chatSlice';

export interface MessageSection {
  title: string;
  data: Message[];
}

export function useConversationLogic(conversationId: string) {
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const sectionListRef = useRef<SectionList<Message, {title: string}>>(null);

  // Read conversation details from the store.
  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  // State to control the visibility of the scroll down button
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Handler to check if the user is near the bottom of the list
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    // Adjust threshold as needed (here, 20 pixels from bottom)
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

  // Auto-scroll to the latest message when messages update.
  useEffect(() => {
    if (sectionListRef.current && sections.length > 0) {
      const lastSectionIndex = sections.length - 1;
      const lastItemIndex = sections[lastSectionIndex].data.length - 1;
      sectionListRef.current.scrollToLocation({
        sectionIndex: lastSectionIndex,
        itemIndex: lastItemIndex,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [messages]);

  // Handle button click: Pick an image from the library.
  const handleAttach = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) return;
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
        // Dispatch async action to send the message.
        dispatch(
          sendMessage({
            conversationId,
            senderId: user.uid,
            text: asset.base64,
            type: 'image',
          }),
        );
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  // Handle button click: Capture an image using the camera.
  const handleCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) return;
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
        // Dispatch async action to send the message.
        dispatch(
          sendMessage({
            conversationId,
            senderId: user.uid,
            text: asset.base64,
            type: 'image',
          }),
        );
      }
    } catch (err) {
      console.error('Error capturing image:', err);
    }
  };

  // Handle button click: Send a text message.
  const handleSend = async () => {
    if (!inputText.trim() || !user?.uid) return;
    try {
      // Dispatch async action to send the message.
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

// Helper: Group messages by day for SectionList rendering.
export function groupMessagesByDay(messages: Message[]): MessageSection[] {
  const groups: {[key: string]: Message[]} = {};
  messages.forEach(message => {
    const date =
      message.timestamp && typeof message.timestamp.toDate === 'function'
        ? message.timestamp.toDate()
        : new Date(message.timestamp);
    const dateString = date.toDateString();
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(message);
  });

  const sections: MessageSection[] = Object.keys(groups).map(dateString => ({
    title: dateString,
    data: groups[dateString],
  }));

  sections.sort(
    (a, b) => new Date(a.title).getTime() - new Date(b.title).getTime(),
  );
  return sections;
}
