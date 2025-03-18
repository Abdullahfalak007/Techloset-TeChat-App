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
// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
// import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {BottomTabParamList, MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';
// import {useChatList} from './useChatList';
// import {deleteConversation} from '../../store/slices/chatSlice';

// type ChatListNavigationProp = CompositeNavigationProp<
//   BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
//   NativeStackNavigationProp<MainStackParamList>
// >;

// const ChatList = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const {conversations, loading} = useAppSelector(state => state.chat);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<ChatListNavigationProp>();

//   useChatList(user?.uid);

//   const handleOpenConversation = (conversationId: string) => {
//     navigation.navigate('Conversation', {conversationId});
//   };

//   const handleDeleteConversation = (conversationId: string) => {
//     dispatch(deleteConversation({conversationId}));
//   };

//   const renderItem = ({item}: {item: any}) => {
//     // Unread count for current user
//     const unreadCount = item.unreadCounts?.[user?.uid] || 0;

//     return (
//       <View style={styles.itemContainer}>
//         {/* Tap to open conversation */}
//         <TouchableOpacity
//           style={styles.profileContainer}
//           onPress={() => handleOpenConversation(item.id)}>
//           {item.recipientPhoto ? (
//             <Image
//               source={{uri: item.recipientPhoto}}
//               style={styles.profileImage}
//             />
//           ) : (
//             <View style={styles.placeholderAvatar} />
//           )}
//           <View style={styles.textContainer}>
//             <Text style={styles.convTitle}>{item.recipientName}</Text>
//             <Text style={styles.lastMessage}>
//               {item.lastMessage || 'No messages yet'}
//             </Text>
//           </View>

//           {/* Show unread badge if unreadCount > 0 */}
//           {unreadCount > 0 && (
//             <View style={styles.unreadBadge}>
//               <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* Delete icon */}
//         <TouchableOpacity
//           style={styles.deleteIconContainer}
//           onPress={() => handleDeleteConversation(item.id)}>
//           <Image
//             source={ICONS.delete}
//             style={styles.deleteIcon}
//             resizeMode="contain"
//           />
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
//   unreadBadge: {
//     backgroundColor: 'red',
//     borderRadius: 12,
//     minWidth: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   unreadBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     paddingHorizontal: 4,
//   },
//   deleteIconContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: 'red',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   deleteIcon: {
//     width: 18,
//     height: 18,
//     tintColor: '#fff',
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
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList, MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {useChatList} from './useChatList';
import {deleteConversation} from '../../store/slices/chatSlice';

type ChatListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Messages'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export type ConversationDoc = {
  id: string;
  lastMessage: string;
  updatedAt: any;
  participants: string[];
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>;
};

const ChatList = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations, loading} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ChatListNavigationProp>();

  useChatList(user?.uid);

  const handleOpenConversation = (conversationId: string) => {
    navigation.navigate('Conversation', {conversationId});
  };

  const handleDeleteConversation = (conversationId: string) => {
    dispatch(deleteConversation({conversationId}));
  };

  const renderItem = ({item}: {item: ConversationDoc}) => {
    // Get unread count for current user
    const unreadCount = item.unreadCounts?.[user?.uid] || 0;

    return (
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
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteIconContainer}
          onPress={() => handleDeleteConversation(item.id)}>
          <Image
            source={ICONS.delete}
            style={styles.deleteIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  profileContainer: {flexDirection: 'row', alignItems: 'center', flex: 1},
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
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteIcon: {width: 18, height: 18, tintColor: '#fff'},
});
