// // src/screens/conversation/Conversation.tsx
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   SectionList,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
// import {
//   launchCamera,
//   launchImageLibrary,
//   Asset,
// } from 'react-native-image-picker';

// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';
// import {sendMessage, Message} from '../../store/slices/chatSlice';
// import ConversationHeader from '../../components/conversationHeader/ConversationHeader';
// import {groupMessagesByDay} from './useConversation';

// type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

// const Conversation = () => {
//   const route = useRoute<ConversationRouteProp>();
//   const navigation = useNavigation();
//   const {conversationId} = route.params;
//   const {user} = useAppSelector(state => state.auth);
//   const dispatch = useAppDispatch();

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState('');
//   const [loading, setLoading] = useState(true);

//   const sectionListRef = useRef<SectionList<any>>(null);

//   // 1) Transform messages into sections
//   const sections = groupMessagesByDay(messages);

//   useEffect(() => {
//     if (!conversationId) return;
//     const unsubscribe = firestore()
//       .collection('conversations')
//       .doc(conversationId)
//       .collection('messages')
//       .orderBy('timestamp', 'asc')
//       .onSnapshot(
//         snapshot => {
//           const msgs: Message[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             msgs.push({
//               id: doc.id,
//               senderId: data.senderId,
//               text: data.text,
//               type: data.type || 'text', // default to 'text' if missing
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

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (sectionListRef.current && sections.length > 0) {
//       const lastSectionIndex = sections.length - 1;
//       const lastItemIndex = sections[lastSectionIndex].data.length - 1;
//       sectionListRef.current.scrollToLocation({
//         sectionIndex: lastSectionIndex,
//         itemIndex: lastItemIndex,
//         animated: true,
//         viewPosition: 1,
//       });
//     }
//   }, [messages]);

//   const handleAttach = async () => {
//     try {
//       const result = await launchImageLibrary({
//         mediaType: 'photo',
//         includeBase64: true,
//         maxWidth: 800, // Optional: resize for smaller base64 data
//         maxHeight: 800,
//         quality: 0.8,
//       });
//       console.log('Attach result:', result);
//       if (result.didCancel || result.errorCode) {
//         return;
//       }
//       const asset: Asset | undefined = result.assets && result.assets[0];
//       if (asset && asset.base64 && user?.uid) {
//         console.log('Attach: base64 length:', asset.base64.length);
//         // Dispatch message with type='image' and text=asset.base64
//         dispatch(
//           sendMessage({
//             conversationId,
//             senderId: user.uid,
//             text: asset.base64,
//             type: 'image',
//           }),
//         );
//       } else {
//         console.log('Attach: asset or asset.base64 missing', asset);
//       }
//     } catch (err) {
//       console.error('Error picking image:', err);
//     }
//   };

//   const handleCamera = async () => {
//     try {
//       const result = await launchCamera({
//         mediaType: 'photo',
//         includeBase64: true,
//         maxWidth: 800,
//         maxHeight: 800,
//         quality: 0.8,
//       });
//       console.log('Camera result:', result);
//       if (result.didCancel || result.errorCode) {
//         return;
//       }
//       const asset: Asset | undefined = result.assets && result.assets[0];
//       if (asset && asset.base64 && user?.uid) {
//         console.log('Camera: base64 length:', asset.base64.length);
//         dispatch(
//           sendMessage({
//             conversationId,
//             senderId: user.uid,
//             text: asset.base64,
//             type: 'image',
//           }),
//         );
//       } else {
//         console.log('Camera: asset or asset.base64 missing', asset);
//       }
//     } catch (err) {
//       console.error('Error capturing image:', err);
//     }
//   };

//   // Send text message
//   const handleSend = async () => {
//     console.log('step 1');
//     if (!inputText.trim() || !user?.uid) return;
//     console.log('step 2');
//     try {
//       await dispatch(
//         sendMessage({
//           conversationId,
//           senderId: user.uid,
//           text: inputText.trim(),
//           type: 'text',
//         }),
//       );
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//     setInputText('');
//   };

//   // Render each message bubble
//   const renderMessage = ({item}: {item: Message}) => {
//     const isOwnMessage = item.senderId === user?.uid;
//     if (item.type === 'image') {
//       // If it's an image, we display an Image bubble
//       return (
//         <View
//           style={[styles.bubbleContainer, isOwnMessage && styles.bubbleRight]}>
//           <View style={[styles.imageBubble, isOwnMessage && styles.bubbleOwn]}>
//             <Image
//               source={{uri: `data:image/jpeg;base64,${item.text}`}}
//               style={styles.imageContent}
//               resizeMode="cover"
//             />
//             <Text
//               style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
//               {formatTime(item.timestamp)}
//             </Text>
//           </View>
//         </View>
//       );
//     } else {
//       // Normal text bubble
//       return (
//         <View
//           style={[styles.bubbleContainer, isOwnMessage && styles.bubbleRight]}>
//           <View style={[styles.bubble, isOwnMessage && styles.bubbleOwn]}>
//             <Text
//               style={[styles.bubbleText, isOwnMessage && styles.bubbleTextOwn]}>
//               {item.text}
//             </Text>
//             <Text
//               style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
//               {formatTime(item.timestamp)}
//             </Text>
//           </View>
//         </View>
//       );
//     }
//   };

//   // Render day label
//   const renderSectionHeader = ({section}: any) => {
//     return (
//       <View style={{alignSelf: 'center', marginVertical: 8}}>
//         <Text style={{color: '#999', fontSize: 12}}>{section.title}</Text>
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
//       <ConversationHeader
//         conversationId={conversationId}
//         currentUserId={user?.uid}
//         onBackPress={() => navigation.goBack()}
//       />

//       <SectionList
//         ref={sectionListRef}
//         sections={sections}
//         keyExtractor={item => item.id}
//         renderItem={renderMessage}
//         renderSectionHeader={renderSectionHeader}
//         style={styles.messageList}
//         onScrollToIndexFailed={info => {
//           // If scroll fails, try again after a short delay
//           setTimeout(() => {
//             if (sectionListRef.current && sections.length > 0) {
//               const lastSectionIndex = sections.length - 1;
//               const lastItemIndex = sections[lastSectionIndex].data.length - 1;
//               sectionListRef.current.scrollToLocation({
//                 sectionIndex: lastSectionIndex,
//                 itemIndex: lastItemIndex,
//                 animated: true,
//                 viewPosition: 1,
//               });
//             }
//           }, 500);
//         }}
//       />

//       {/* Input bar */}
//       <View style={styles.inputBar}>
//         {/* Paperclip on the left => pick an image */}
//         <TouchableOpacity style={styles.iconOutside} onPress={handleAttach}>
//           <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
//         </TouchableOpacity>

//         {/* Middle container => text input & send icon */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Write your message"
//             placeholderTextColor="#999"
//             value={inputText}
//             onChangeText={setInputText}
//           />
//           <TouchableOpacity style={styles.sendIconWrapper} onPress={handleSend}>
//             <Image source={ICONS.send} style={styles.sendIcon} />
//           </TouchableOpacity>
//         </View>

//         {/* Camera on the right => capture an image */}
//         <TouchableOpacity style={styles.iconOutside} onPress={handleCamera}>
//           <Image source={ICONS.camera} style={styles.iconOutsideImage} />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default Conversation;

// // Format time as 12-hour with AM/PM
// function formatTime(timestamp: any) {
//   const time =
//     timestamp && typeof timestamp.toDate === 'function'
//       ? timestamp.toDate()
//       : timestamp
//       ? new Date(timestamp)
//       : new Date();
//   return time.toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });
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
//   bubbleContainer: {
//     marginVertical: 4,
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//   },
//   bubbleRight: {
//     justifyContent: 'flex-end',
//   },
//   // text bubble
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

//   // image bubble
//   imageBubble: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     padding: 4,
//     backgroundColor: '#F3F3F3',
//     maxWidth: '75%',
//   },
//   imageContent: {
//     width: 200,
//     height: 200,
//     borderRadius: 8,
//   },

//   // Input bar
//   inputBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 8,
//     paddingBottom: 8,
//     paddingTop: 4,
//   },
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
import {groupMessagesByDay, MessageSection} from './useConversation';

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

  // Reference for auto-scrolling
  const sectionListRef = useRef<SectionList<Message, {title: string}>>(null);

  // Get conversation for recipient avatar
  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  // Transform messages into sections
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

  // Reset unread counts for the current user
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

  // Auto-scroll to bottom when messages change
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
  }, [messages, sections]);

  // PICK AN IMAGE (paperclip)
  const handleAttach = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) {
        return;
      }
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
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

  // CAPTURE AN IMAGE (camera)
  const handleCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) {
        return;
      }
      const asset: Asset | undefined = result.assets && result.assets[0];
      if (asset && asset.base64 && user?.uid) {
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

  // SEND TEXT MESSAGE
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

  // // RENDER MESSAGE: with consecutive-sender avatar logic
  // const renderMessage = ({
  //   item,
  //   index,
  //   section,
  // }: {
  //   item: Message;
  //   index: number;
  //   section: MessageSection;
  // }) => {
  //   const isOwnMessage = item.senderId === user?.uid;

  //   // Check if the next message in the section is from the same sender.
  //   const isLastInSection = index === section.data.length - 1;
  //   let nextSenderId: string | null = null;
  //   if (!isLastInSection) {
  //     nextSenderId = section.data[index + 1].senderId;
  //   }
  //   const showAvatar = isLastInSection || nextSenderId !== item.senderId;

  //   // Determine which avatar to show
  //   let senderAvatar = ICONS.avatar;
  //   if (isOwnMessage) {
  //     if (user?.base64Photo) {
  //       senderAvatar = {uri: user.base64Photo};
  //     } else if (user?.photoURL) {
  //       senderAvatar = {uri: user.photoURL};
  //     }
  //   } else {
  //     if (conversation?.recipientPhoto) {
  //       senderAvatar = {uri: conversation.recipientPhoto};
  //     }
  //   }

  //   // Render bubble with optional avatar
  //   if (item.type === 'image') {
  //     return (
  //       <View
  //         style={[
  //           styles.messageRow,
  //           isOwnMessage ? styles.rowLeft : styles.rowRight,
  //         ]}>
  //         {!isOwnMessage && showAvatar && (
  //           <Image source={senderAvatar} style={styles.senderAvatarLeft} />
  //         )}
  //         {isOwnMessage && showAvatar && (
  //           <Image source={senderAvatar} style={styles.senderAvatarRight} />
  //         )}
  //         <View
  //           style={[
  //             styles.bubbleContainer,
  //             isOwnMessage && styles.bubbleRight,
  //             styles.imageBubble,
  //             isOwnMessage && styles.bubbleOwn,
  //           ]}>
  //           <Image
  //             source={{uri: `data:image/jpeg;base64,${item.text}`}}
  //             style={styles.imageContent}
  //             resizeMode="cover"
  //           />
  //           <Text
  //             style={[styles.bubbleTime, isOwnMessage && styles.bubbleTimeOwn]}>
  //             {formatTime(item.timestamp)}
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View
  //         style={[
  //           styles.messageRow,
  //           isOwnMessage ? styles.rowLeft : styles.rowRight,
  //         ]}>
  //         {!isOwnMessage && showAvatar && (
  //           <Image source={senderAvatar} style={styles.senderAvatarLeft} />
  //         )}
  //         {isOwnMessage && showAvatar && (
  //           <Image source={senderAvatar} style={styles.senderAvatarRight} />
  //         )}
  //         <View
  //           style={[
  //             styles.bubbleContainer,
  //             isOwnMessage && styles.bubbleRight,
  //             styles.bubble,
  //             isOwnMessage && styles.bubbleOwn,
  //           ]}>
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
  //   }
  // };

  const renderMessage = ({
    item,
    index,
    section,
  }: {
    item: Message;
    index: number;
    section: MessageSection;
  }) => {
    const isOwnMessage = item.senderId === user?.uid;

    // Show header if this is the first message in the section,
    // or if the previous message is from a different sender.
    const showHeader =
      index === 0 || section.data[index - 1].senderId !== item.senderId;

    // Determine which avatar and name to display.
    let senderAvatar = ICONS.avatar;
    let senderName = '';
    if (isOwnMessage) {
      if (user?.base64Photo) {
        senderAvatar = {uri: user.base64Photo};
      } else if (user?.photoURL) {
        senderAvatar = {uri: user.photoURL};
      }
      senderName = 'You'; // or user.displayName
    } else {
      if (conversation?.recipientPhoto) {
        senderAvatar = {uri: conversation.recipientPhoto};
      }
      senderName = conversation?.recipientName || 'Unknown';
    }

    return (
      <View style={{marginBottom: 8}}>
        {showHeader && (
          <View style={styles.headerRow}>
            <Image source={senderAvatar} style={styles.senderHeaderAvatar} />
            <Text style={styles.senderName}>{senderName}</Text>
          </View>
        )}
        {item.type === 'image' ? (
          <View
            style={[
              styles.messageRow,
              isOwnMessage ? styles.rowLeft : styles.rowRight,
            ]}>
            <View
              style={[
                styles.bubbleContainer,
                isOwnMessage && styles.bubbleRight,
                styles.imageBubble,
                isOwnMessage && styles.bubbleOwn,
              ]}>
              <Image
                source={{uri: `data:image/jpeg;base64,${item.text}`}}
                style={styles.imageContent}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.bubbleTime,
                  isOwnMessage && styles.bubbleTimeOwn,
                ]}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.messageRow,
              isOwnMessage ? styles.rowLeft : styles.rowRight,
            ]}>
            <View
              style={[
                styles.bubbleContainer,
                isOwnMessage && styles.bubbleRight,
                styles.bubble,
                isOwnMessage && styles.bubbleOwn,
              ]}>
              <Text
                style={[
                  styles.bubbleText,
                  isOwnMessage && styles.bubbleTextOwn,
                ]}>
                {item.text}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  isOwnMessage && styles.bubbleTimeOwn,
                ]}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  // RENDER SECTION HEADER
  const renderSectionHeader = ({section}: {section: MessageSection}) => {
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
      <SectionList<Message, {title: string}>
        ref={sectionListRef}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({item, index, section}) =>
          renderMessage({item, index, section})
        }
        renderSectionHeader={renderSectionHeader}
        style={styles.messageList}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        onScrollToIndexFailed={info => {
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
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.iconOutside} onPress={handleAttach}>
          <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.iconOutside} onPress={handleCamera}>
          <Image source={ICONS.camera} style={styles.iconOutsideImage} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Conversation;

// Helper: Format time as e.g. "09:25 AM"
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
  // Row for avatar + bubble
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  rowLeft: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  rowRight: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: 30,
  },

  // Avatars
  senderAvatarLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  senderAvatarRight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderHeaderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  senderName: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '600',
  },

  // Bubble container
  bubbleContainer: {
    maxWidth: '70%',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: 16,
    padding: 10,
  },
  bubbleOwn: {
    backgroundColor: COLORS.textColor,
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
  // Image bubble styles
  imageBubble: {
    overflow: 'hidden',
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
