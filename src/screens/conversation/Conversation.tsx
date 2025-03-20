// // // src/screens/conversation/Conversation.tsx
// // import React, {useEffect, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// // } from 'react-native';
// // import firestore from '@react-native-firebase/firestore';
// // import {RouteProp, useRoute} from '@react-navigation/native';
// // import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// // import {MainStackParamList} from '../../constants/types';
// // import {COLORS} from '../../constants/colors';
// // import {sendMessage} from '../../store/slices/chatSlice';

// // type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

// // interface MessageDoc {
// //   id: string;
// //   senderId: string;
// //   text: string;
// //   timestamp: any; // Firestore Timestamp or number
// // }

// // const Conversation = () => {
// //   const route = useRoute<ConversationRouteProp>();
// //   const {conversationId} = route.params; // Must match { conversationId: string }
// //   const {user} = useAppSelector(state => state.auth);
// //   const dispatch = useAppDispatch();

// //   const [messages, setMessages] = useState<MessageDoc[]>([]);
// //   const [inputText, setInputText] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   // Listen to messages in real time
// //   useEffect(() => {
// //     if (!conversationId) return;
// //     const unsubscribe = firestore()
// //       .collection('conversations')
// //       .doc(conversationId)
// //       .collection('messages')
// //       .orderBy('timestamp', 'asc')
// //       .onSnapshot(
// //         snapshot => {
// //           const msgs: MessageDoc[] = [];
// //           snapshot.forEach(doc => {
// //             const data = doc.data();
// //             msgs.push({
// //               id: doc.id,
// //               senderId: data.senderId,
// //               text: data.text,
// //               timestamp: data.timestamp,
// //             });
// //           });
// //           setMessages(msgs);
// //           setLoading(false);
// //         },
// //         error => {
// //           console.error('Error fetching messages:', error);
// //           setLoading(false);
// //         },
// //       );
// //     return () => unsubscribe();
// //   }, [conversationId]);

// //   // Reset unread counts for the current user when opening conversation
// //   useEffect(() => {
// //     if (!conversationId || !user?.uid) return;
// //     const docRef = firestore().collection('conversations').doc(conversationId);
// //     const resetUnreadIfNeeded = async () => {
// //       try {
// //         const convSnap = await docRef.get();
// //         if (!convSnap.exists) return;
// //         const convData = convSnap.data() || {};
// //         const existingUnread = convData.unreadCounts || {};
// //         if (existingUnread[user.uid] && existingUnread[user.uid] > 0) {
// //           existingUnread[user.uid] = 0;
// //           await docRef.update({unreadCounts: existingUnread});
// //         }
// //       } catch (err) {
// //         console.error('Error resetting unread:', err);
// //       }
// //     };
// //     resetUnreadIfNeeded();
// //   }, [conversationId, user?.uid]);

// //   // Handler for sending messages using the sendMessage thunk.
// //   const handleSend = async () => {
// //     if (!inputText.trim() || !user?.uid) return;
// //     try {
// //       await dispatch(
// //         sendMessage({
// //           conversationId,
// //           senderId: user.uid,
// //           text: inputText.trim(),
// //         }),
// //       );
// //     } catch (err) {
// //       console.error('Error sending message:', err);
// //     }
// //     setInputText('');
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color={COLORS.black} />
// //       </View>
// //     );
// //   }

// //   const renderItem = ({item}: {item: MessageDoc}) => {
// //     const isOwnMessage = item.senderId === user?.uid;
// //     return (
// //       <View
// //         style={[styles.messageContainer, isOwnMessage && styles.ownMessage]}>
// //         <Text style={styles.messageText}>{item.text}</Text>
// //         <Text style={styles.messageTime}>
// //           {item.timestamp
// //             ? new Date(
// //                 item.timestamp.toDate?.() || item.timestamp,
// //               ).toLocaleTimeString()
// //             : ''}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={messages}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.id}
// //         style={styles.messageList}
// //       />
// //       <View style={styles.inputContainer}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Type your message..."
// //           placeholderTextColor="#999"
// //           value={inputText}
// //           onChangeText={setInputText}
// //         />
// //         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
// //           <Text style={styles.sendButtonText}>Send</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // export default Conversation;

// // const styles = StyleSheet.create({
// //   container: {flex: 1, backgroundColor: COLORS.white},
// //   centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
// //   messageList: {flex: 1, paddingHorizontal: 10},
// //   messageContainer: {
// //     backgroundColor: '#eee',
// //     marginVertical: 4,
// //     padding: 8,
// //     borderRadius: 8,
// //     alignSelf: 'flex-start',
// //     maxWidth: '80%',
// //   },
// //   ownMessage: {backgroundColor: COLORS.gradientStart, alignSelf: 'flex-end'},
// //   messageText: {color: COLORS.black, fontSize: 14},
// //   messageTime: {color: '#888', fontSize: 10, marginTop: 2, textAlign: 'right'},
// //   inputContainer: {
// //     flexDirection: 'row',
// //     borderTopWidth: 1,
// //     borderTopColor: '#ccc',
// //     padding: 6,
// //   },
// //   input: {
// //     flex: 1,
// //     backgroundColor: '#f4f4f4',
// //     borderRadius: 4,
// //     paddingHorizontal: 10,
// //     marginRight: 6,
// //   },
// //   sendButton: {
// //     backgroundColor: COLORS.gradientEnd,
// //     paddingHorizontal: 12,
// //     justifyContent: 'center',
// //     borderRadius: 4,
// //   },
// //   sendButtonText: {color: COLORS.white, fontWeight: 'bold'},
// // });

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';
// import {sendMessage} from '../../store/slices/chatSlice';
// import ConversationHeader from '../../components/conversationHeader/ConversationHeader'; // adjust import path if needed

// type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

// interface MessageDoc {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: any; // Firestore Timestamp or number
// }

// const Conversation = () => {
//   const route = useRoute<ConversationRouteProp>();
//   const navigation = useNavigation();
//   const {conversationId} = route.params;
//   const {user} = useAppSelector(state => state.auth);
//   const dispatch = useAppDispatch();

//   const [messages, setMessages] = useState<MessageDoc[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Listen to messages in real time
//   useEffect(() => {
//     if (!conversationId) return;
//     const unsubscribe = firestore()
//       .collection('conversations')
//       .doc(conversationId)
//       .collection('messages')
//       .orderBy('timestamp', 'asc')
//       .onSnapshot(
//         snapshot => {
//           const msgs: MessageDoc[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             msgs.push({
//               id: doc.id,
//               senderId: data.senderId,
//               text: data.text,
//               timestamp: data.timestamp,
//             });
//           });
//           setMessages(msgs);
//           setLoading(false);
//         },
//         error => {
//           console.error('Error fetching messages:', error);
//           setLoading(false);
//         },
//       );
//     return () => unsubscribe();
//   }, [conversationId]);

//   // Reset unread counts for the current user
//   useEffect(() => {
//     if (!conversationId || !user?.uid) return;
//     const docRef = firestore().collection('conversations').doc(conversationId);
//     const resetUnreadIfNeeded = async () => {
//       try {
//         const convSnap = await docRef.get();
//         if (!convSnap.exists) return;
//         const convData = convSnap.data() || {};
//         const existingUnread = convData.unreadCounts || {};
//         if (existingUnread[user.uid] && existingUnread[user.uid] > 0) {
//           existingUnread[user.uid] = 0;
//           await docRef.update({unreadCounts: existingUnread});
//         }
//       } catch (err) {
//         console.error('Error resetting unread:', err);
//       }
//     };
//     resetUnreadIfNeeded();
//   }, [conversationId, user?.uid]);

//   // Handler for sending messages
//   const handleSend = async () => {
//     if (!inputText.trim() || !user?.uid) return;
//     try {
//       await dispatch(
//         sendMessage({
//           conversationId,
//           senderId: user.uid,
//           text: inputText.trim(),
//         }),
//       );
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//     setInputText('');
//   };

//   // Renders each chat bubble
//   const renderItem = ({item}: {item: MessageDoc}) => {
//     const isOwnMessage = item.senderId === user?.uid;
//     return (
//       <View
//         style={[styles.bubbleContainer, isOwnMessage && styles.bubbleRight]}>
//         <View style={[styles.bubble, isOwnMessage && styles.bubbleOwn]}>
//           <Text
//             style={[styles.bubbleText, isOwnMessage && styles.bubbleTextOwn]}>
//             {item.text}
//           </Text>
//           <Text
//             style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
//             {formatTime(item.timestamp)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   // If you want a “Today” label at the top
//   const renderListHeader = () => {
//     if (messages.length === 0) return null;
//     return (
//       <View style={{alignSelf: 'center', marginVertical: 8}}>
//         <Text style={{color: '#999', fontSize: 12}}>Today</Text>
//       </View>
//     );
//   };

//   // Custom input bar that matches your screenshot
//   const renderInputBar = () => {
//     return (
//       <View style={styles.inputBar}>
//         {/* Paperclip on the left (outside the text field) */}
//         <TouchableOpacity style={styles.iconOutside}>
//           <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
//         </TouchableOpacity>

//         {/* Rounded container for the text input & send icon */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Write your message"
//             placeholderTextColor="#999"
//             value={inputText}
//             onChangeText={setInputText}
//           />
//           {/* Send icon on the right INSIDE the input container */}
//           <TouchableOpacity style={styles.sendIconWrapper} onPress={handleSend}>
//             <Image source={ICONS.send} style={styles.sendIcon} />
//           </TouchableOpacity>
//         </View>

//         {/* Camera on the right (outside the text field) */}
//         <TouchableOpacity style={styles.iconOutside}>
//           <Image source={ICONS.camera} style={styles.iconOutsideImage} />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={COLORS.black} />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       {/* If using your custom header: */}
//       <ConversationHeader
//         recipientName="Jhon Abraham" // or dynamically from Firestore
//         recipientPhoto={null} // or from Firestore
//         onBackPress={() => navigation.goBack()}
//       />

//       {/* Chat messages list */}
//       <FlatList
//         data={messages}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         style={styles.messageList}
//         ListHeaderComponent={renderListHeader}
//       />

//       {/* Input bar */}
//       {renderInputBar()}
//     </KeyboardAvoidingView>
//   );
// };

// export default Conversation;

// // Helper to format timestamp -> “09:25 AM”
// function formatTime(timestamp: any) {
//   if (!timestamp) return '';
//   const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//   return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   messageList: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },

//   // Bubbles
//   bubbleContainer: {
//     marginVertical: 4,
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//   },
//   bubbleRight: {
//     justifyContent: 'flex-end',
//   },
//   bubble: {
//     backgroundColor: '#F3F3F3',
//     borderRadius: 16,
//     padding: 10,
//     maxWidth: '75%',
//   },
//   bubbleOwn: {
//     backgroundColor: COLORS.gradientStart,
//   },
//   bubbleText: {
//     color: COLORS.black,
//     fontSize: 14,
//   },
//   bubbleTextOwn: {
//     color: COLORS.white,
//   },
//   bubbleTime: {
//     fontSize: 10,
//     color: '#999',
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   bubbleTimeOwn: {
//     color: '#ddd',
//   },

//   // Input bar container
//   inputBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 8,
//     paddingBottom: 8,
//     paddingTop: 4,
//   },
//   // The icons on the far left and far right
//   iconOutside: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#F3F3F3',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconOutsideImage: {
//     width: 18,
//     height: 18,
//     tintColor: '#9FA5C0',
//     resizeMode: 'contain',
//   },

//   // Container for the text input and send icon
//   inputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#F7F9FB',
//     borderRadius: 20,
//     alignItems: 'center',
//     marginHorizontal: 8,
//     paddingHorizontal: 12,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.black,
//     paddingVertical: 6,
//   },
//   // The send icon inside the input container
//   sendIconWrapper: {
//     width: 24,
//     height: 24,
//     marginLeft: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendIcon: {
//     width: 20,
//     height: 20,
//     tintColor: '#9FA5C0',
//     resizeMode: 'contain',
//   },
// });

// src/screens/conversation/Conversation.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  SectionList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {sendMessage, Message} from '../../store/slices/chatSlice';
import ConversationHeader from '../../components/conversationHeader/ConversationHeader';
import {groupMessagesByDay} from './useConversation';

type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

const Conversation = () => {
  const route = useRoute<ConversationRouteProp>();
  const navigation = useNavigation();
  const {conversationId} = route.params;
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const sectionListRef = useRef<SectionList<any>>(null);

  // 1) Transform messages into sections
  const sections = groupMessagesByDay(messages);

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
              type: data.type || 'text', // default to 'text' if missing
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

  // Reset unread counts for the current user
  useEffect(() => {
    if (!conversationId || !user?.uid) return;
    const docRef = firestore().collection('conversations').doc(conversationId);
    const resetUnreadIfNeeded = async () => {
      try {
        const convSnap = await docRef.get();
        if (!convSnap.exists) return;
        const convData = convSnap.data() || {};
        const existingUnread = convData.unreadCounts || {};
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (sectionListRef.current && sections.length > 0) {
      const lastSectionIndex = sections.length - 1;
      const lastItemIndex = sections[lastSectionIndex].data.length - 1;
      sectionListRef.current.scrollToLocation({
        sectionIndex: lastSectionIndex,
        itemIndex: lastItemIndex,
        animated: true,
        viewPosition: 1,
      });
    }
  }, [messages]);

  const handleAttach = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800, // Optional: resize for smaller base64 data
        maxHeight: 800,
        quality: 0.8,
      });
      console.log('Attach result:', result);
      if (result.didCancel || result.errorCode) {
        return;
      }
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
        console.log('Attach: base64 length:', asset.base64.length);
        // Dispatch message with type='image' and text=asset.base64
        dispatch(
          sendMessage({
            conversationId,
            senderId: user.uid,
            text: asset.base64,
            type: 'image',
          }),
        );
      } else {
        console.log('Attach: asset or asset.base64 missing', asset);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      console.log('Camera result:', result);
      if (result.didCancel || result.errorCode) {
        return;
      }
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
        console.log('Camera: base64 length:', asset.base64.length);
        dispatch(
          sendMessage({
            conversationId,
            senderId: user.uid,
            text: asset.base64,
            type: 'image',
          }),
        );
      } else {
        console.log('Camera: asset or asset.base64 missing', asset);
      }
    } catch (err) {
      console.error('Error capturing image:', err);
    }
  };

  // Send text message
  const handleSend = async () => {
    console.log('step 1');
    if (!inputText.trim() || !user?.uid) return;
    console.log('step 2');
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

  // Render each message bubble
  const renderMessage = ({item}: {item: Message}) => {
    const isOwnMessage = item.senderId === user?.uid;
    if (item.type === 'image') {
      // If it's an image, we display an Image bubble
      return (
        <View
          style={[styles.bubbleContainer, isOwnMessage && styles.bubbleRight]}>
          <View style={[styles.imageBubble, isOwnMessage && styles.bubbleOwn]}>
            <Image
              source={{uri: `data:image/jpeg;base64,${item.text}`}}
              style={styles.imageContent}
              resizeMode="cover"
            />
            <Text
              style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      );
    } else {
      // Normal text bubble
      return (
        <View
          style={[styles.bubbleContainer, isOwnMessage && styles.bubbleRight]}>
          <View style={[styles.bubble, isOwnMessage && styles.bubbleOwn]}>
            <Text
              style={[styles.bubbleText, isOwnMessage && styles.bubbleTextOwn]}>
              {item.text}
            </Text>
            <Text
              style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      );
    }
  };

  // Render day label
  const renderSectionHeader = ({section}: any) => {
    return (
      <View style={{alignSelf: 'center', marginVertical: 8}}>
        <Text style={{color: '#999', fontSize: 12}}>{section.title}</Text>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ConversationHeader
        conversationId={conversationId}
        currentUserId={user?.uid}
        onBackPress={() => navigation.goBack()}
      />

      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        renderSectionHeader={renderSectionHeader}
        style={styles.messageList}
        onScrollToIndexFailed={info => {
          // If scroll fails, try again after a short delay
          setTimeout(() => {
            if (sectionListRef.current && sections.length > 0) {
              const lastSectionIndex = sections.length - 1;
              const lastItemIndex = sections[lastSectionIndex].data.length - 1;
              sectionListRef.current.scrollToLocation({
                sectionIndex: lastSectionIndex,
                itemIndex: lastItemIndex,
                animated: true,
                viewPosition: 1,
              });
            }
          }, 500);
        }}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* Paperclip on the left => pick an image */}
        <TouchableOpacity style={styles.iconOutside} onPress={handleAttach}>
          <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
        </TouchableOpacity>

        {/* Middle container => text input & send icon */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write your message"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendIconWrapper} onPress={handleSend}>
            <Image source={ICONS.send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>

        {/* Camera on the right => capture an image */}
        <TouchableOpacity style={styles.iconOutside} onPress={handleCamera}>
          <Image source={ICONS.camera} style={styles.iconOutsideImage} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Conversation;

// Format time as 12-hour with AM/PM
function formatTime(timestamp: any) {
  const time =
    timestamp && typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : timestamp
      ? new Date(timestamp)
      : new Date();
  return time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  bubbleContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  // text bubble
  bubble: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 10,
    maxWidth: '75%',
  },
  bubbleOwn: {
    backgroundColor: COLORS.gradientStart,
  },
  bubbleText: {
    color: COLORS.black,
    fontSize: 14,
  },
  bubbleTextOwn: {
    color: COLORS.white,
  },
  bubbleTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  bubbleTimeOwn: {
    color: '#ddd',
  },

  // image bubble
  imageBubble: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 4,
    backgroundColor: '#F3F3F3',
    maxWidth: '75%',
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  iconOutside: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOutsideImage: {
    width: 18,
    height: 18,
    tintColor: '#9FA5C0',
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F7F9FB',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 6,
  },
  sendIconWrapper: {
    width: 24,
    height: 24,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#9FA5C0',
    resizeMode: 'contain',
  },
});
