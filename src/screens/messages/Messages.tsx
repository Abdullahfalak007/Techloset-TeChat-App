// // src/screens/messages/Messages.tsx

// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import {useMessages} from './useMessages';
// import {COLORS} from '../../constants/colors';
// import {useNavigation} from '@react-navigation/native';
// import {StackScreenProps} from '@react-navigation/stack';
// import {MainStackParamList} from '../../constants/types';

// type MessagesScreenProps = StackScreenProps<MainStackParamList, 'Messages'>;

// const Messages: React.FC<MessagesScreenProps> = ({navigation}) => {
//   const {conversations, loading} = useMessages();
//   const navigation = useNavigation<MessagesNavProp>();

//   const handleOpenConversation = (conversationId: string) => {
//     navigation.navigate('Conversation', {conversationId});
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={COLORS.black} />
//       </View>
//     );
//   }

//   if (conversations.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text>No conversations yet.</Text>
//       </View>
//     );
//   }

//   const renderItem = ({item}: any) => (
//     <TouchableOpacity
//       style={styles.itemContainer}
//       onPress={() => handleOpenConversation(item.id)}>
//       <Text style={styles.title}>Conversation: {item.id}</Text>
//       <Text style={styles.subtitle}>
//         {item.lastMessage || 'No messages yet'}
//       </Text>
//     </TouchableOpacity>
//   );

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

// export default Messages;

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: COLORS.white},
//   centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   itemContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   title: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
//   subtitle: {fontSize: 14, color: COLORS.textColor, marginTop: 4},
// });
