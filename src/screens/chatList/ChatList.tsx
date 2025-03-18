// // src/screens/chatList/ChatList.tsx
// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
// } from 'react-native';
// import firestore, {
//   FirebaseFirestoreTypes,
// } from '@react-native-firebase/firestore';
// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
// import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {BottomTabParamList, MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';
// import {useChatList} from './useChatList';
// import {deleteConversation} from '../../store/slices/chatSlice';

// export type ConversationDoc = {
//   id: string;
//   lastMessage: string;
//   updatedAt: FirebaseFirestoreTypes.Timestamp;
//   participants: string[];
//   recipientName: string;
//   recipientPhoto?: string | null;
// };

// type ChatListNavigationProp = CompositeNavigationProp<
//   BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
//   NativeStackNavigationProp<MainStackParamList>
// >;

// const ChatList = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const {conversations, loading} = useAppSelector(state => state.chat);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<ChatListNavigationProp>();

//   // Listen to conversations from the hook
//   useChatList(user?.uid);

//   const handleOpenConversation = (conversationId: string) => {
//     navigation.navigate('Conversation', {conversationId});
//   };

//   const handleDeleteConversation = (conversationId: string) => {
//     dispatch(deleteConversation({conversationId}));
//   };

//   const renderItem = ({item}: {item: ConversationDoc}) => (
//     <View style={styles.itemContainer}>
//       <TouchableOpacity
//         style={styles.profileContainer}
//         onPress={() => handleOpenConversation(item.id)}>
//         {item.recipientPhoto ? (
//           <Image
//             source={{uri: item.recipientPhoto}}
//             style={styles.profileImage}
//           />
//         ) : (
//           <View style={styles.placeholderAvatar} />
//         )}
//         <View style={styles.textContainer}>
//           <Text style={styles.convTitle}>{item.recipientName}</Text>
//           <Text style={styles.lastMessage}>
//             {item.lastMessage || 'No messages yet'}
//           </Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.deleteIconContainer}
//         onPress={() => handleDeleteConversation(item.id)}>
//         <Image source={ICONS.delete} style={styles.deleteIcon} />
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={COLORS.black} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={conversations}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default ChatList;

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
//   centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 12,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   profileContainer: {flexDirection: 'row', alignItems: 'center', flex: 1},
//   profileImage: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
//   placeholderAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#ccc',
//     marginRight: 10,
//   },
//   textContainer: {flex: 1},
//   convTitle: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
//   lastMessage: {fontSize: 14, color: COLORS.textColor, marginTop: 4},
//   deleteIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'red',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   deleteIcon: {
//     width: 20,
//     height: 20,
//     tintColor: COLORS.white,
//   },
// });

// src/screens/chatList/ChatList.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList, MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {useChatList} from './useChatList';
import {deleteConversation} from '../../store/slices/chatSlice';

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
};

// Use a composite navigation prop so that we can navigate from a bottom tab to a MainStack screen.
type ChatListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const ChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ChatListNavigationProp>();

  // Set up Firestore listener via our custom hook
  useChatList(user?.uid);

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Conversation', {conversationId});
  };

  const handleDeleteConversation = (conversationId: string) => {
    dispatch(deleteConversation({conversationId}));
  };

  const renderRightActions = (
    progress: any,
    dragX: any,
    item: ConversationDoc,
  ) => {
    return (
      <TouchableOpacity
        style={styles.deleteIconContainer}
        onPress={() => handleDeleteConversation(item.id)}>
        <Image
          source={ICONS.delete}
          style={styles.deleteIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}: {item: ConversationDoc}) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => handleOpenConversation(item.id)}>
          {item.recipientPhoto ? (
            <Image
              source={{uri: item.recipientPhoto}}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderAvatar} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.convTitle}>{item.recipientName}</Text>
            <Text style={styles.lastMessage}>
              {item.lastMessage || 'No messages yet'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  itemContainer: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  textContainer: {flex: 1},
  convTitle: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
  lastMessage: {fontSize: 14, color: COLORS.textColor, marginTop: 4},
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.white,
  },
});
