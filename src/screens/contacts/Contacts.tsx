// // // src/screens/contacts/Contacts.tsx
// // import React, {useEffect, useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Image,
// // } from 'react-native';
// // import firestore from '@react-native-firebase/firestore';
// // import {useAppSelector} from '../../hooks/useStore';
// // import {useNavigation} from '@react-navigation/native';
// // import {StackNavigationProp} from '@react-navigation/stack';
// // import {MainStackParamList} from '../../constants/types';
// // import {COLORS} from '../../constants/colors';
// // import {ICONS} from '../../constants';

// // interface Contact {
// //   uid: string;
// //   email: string;
// //   displayName: string | null;
// //   photoURL: string | null;
// //   base64Photo: string | null;
// // }

// // type ContactsNavProp = StackNavigationProp<MainStackParamList, 'Conversation'>;

// // const Contacts = () => {
// //   const {user} = useAppSelector(state => state.auth);
// //   const navigation = useNavigation<ContactsNavProp>();
// //   const [contacts, setContacts] = useState<Contact[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const unsubscribe = firestore()
// //       .collection('users')
// //       .onSnapshot(
// //         snapshot => {
// //           const list: Contact[] = [];
// //           snapshot.forEach(doc => {
// //             const data = doc.data();
// //             if (data.uid !== user?.uid) {
// //               list.push({
// //                 uid: data.uid,
// //                 email: data.email,
// //                 displayName: data.displayName || null,
// //                 photoURL: data.photoURL || null,
// //                 base64Photo: data.base64Photo || null,
// //               });
// //             }
// //           });
// //           setContacts(list);
// //           setLoading(false);
// //         },
// //         error => {
// //           console.error('Error fetching contacts:', error);
// //           setLoading(false);
// //         },
// //       );
// //     return () => unsubscribe();
// //   }, [user?.uid]);

// //   // On tapping a contact, create a conversation and navigate to it.
// //   const handleAddContact = async (otherUid: string) => {
// //     if (!user?.uid) return;
// //     try {
// //       // Create a conversation in Firestore if one doesn't exist.
// //       const convRef = await firestore()
// //         .collection('conversations')
// //         .add({
// //           participants: [user.uid, otherUid],
// //           lastMessage: '',
// //           createdAt: firestore.FieldValue.serverTimestamp(),
// //           updatedAt: firestore.FieldValue.serverTimestamp(),
// //         });
// //       const conversationId = convRef.id;
// //       navigation.navigate('Conversation', {conversationId});
// //     } catch (error) {
// //       console.error('Failed to start conversation:', error);
// //     }
// //   };

// //   const renderItem = ({item}: {item: Contact}) => {
// //     const avatarSource = item.base64Photo
// //       ? {uri: item.base64Photo}
// //       : item.photoURL
// //       ? {uri: item.photoURL}
// //       : ICONS.avatar;
// //     return (
// //       <View style={styles.contactRow}>
// //         <View style={styles.leftContainer}>
// //           <Image source={avatarSource} style={styles.avatar} />
// //           <View style={styles.textContainer}>
// //             <Text style={styles.name}>{item.displayName || item.email}</Text>
// //             <Text style={styles.subtitle}>Life is beautiful 👌</Text>
// //           </View>
// //         </View>
// //         <TouchableOpacity onPress={() => handleAddContact(item.uid)}>
// //           <Image source={ICONS.addContact} style={styles.addIcon} />
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color={COLORS.black} />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {contacts.length === 0 ? (
// //         <Text>No other users found.</Text>
// //       ) : (
// //         <FlatList
// //           data={contacts}
// //           keyExtractor={item => item.uid}
// //           renderItem={renderItem}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // export default Contacts;

// // const styles = StyleSheet.create({
// //   container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
// //   centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
// //   contactRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //     justifyContent: 'space-between',
// //   },
// //   leftContainer: {flexDirection: 'row', alignItems: 'center'},
// //   avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
// //   textContainer: {justifyContent: 'center'},
// //   name: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
// //   subtitle: {fontSize: 14, color: COLORS.textColor, marginTop: 2},
// //   addIcon: {width: 24, height: 24, tintColor: COLORS.black},
// // });

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {useAppSelector} from '../../hooks/useStore';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';

// interface Contact {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   base64Photo: string | null;
// }

// type ContactsNavProp = StackNavigationProp<MainStackParamList, 'Conversation'>;

// const Contacts = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const {conversations} = useAppSelector(state => state.chat);
//   const navigation = useNavigation<ContactsNavProp>();
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user?.uid) {
//       setLoading(false);
//       return;
//     }

//     // 1) Build a set of participant UIDs that the current user already has a conversation with
//     const existingContactIds = new Set<string>();
//     conversations.forEach(conv => {
//       conv.participants.forEach(participantUid => {
//         // If participant is not me, add them to the set
//         if (participantUid !== user.uid) {
//           existingContactIds.add(participantUid);
//         }
//       });
//     });

//     // 2) Fetch all users from Firestore
//     const unsubscribe = firestore()
//       .collection('users')
//       .onSnapshot(
//         snapshot => {
//           const list: Contact[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             // Skip the current user
//             if (data.uid === user.uid) return;

//             // Create contact object
//             const contactObj: Contact = {
//               uid: data.uid,
//               email: data.email,
//               displayName: data.displayName || null,
//               photoURL: data.photoURL || null,
//               base64Photo: data.base64Photo || null,
//             };
//             list.push(contactObj);
//           });

//           // 3) Filter out contacts already in existingContactIds
//           const filteredContacts = list.filter(
//             contact => !existingContactIds.has(contact.uid),
//           );

//           setContacts(filteredContacts);
//           setLoading(false);
//         },
//         error => {
//           console.error('Error fetching contacts:', error);
//           setLoading(false);
//         },
//       );

//     return () => unsubscribe();
//   }, [user?.uid, conversations]);

//   // On tapping a contact, create a conversation in Firestore and navigate to it.
//   const handleAddContact = async (otherUid: string) => {
//     if (!user?.uid) return;
//     try {
//       // Create a new conversation if none exists
//       const convRef = await firestore()
//         .collection('conversations')
//         .add({
//           participants: [user.uid, otherUid],
//           lastMessage: '',
//           createdAt: firestore.FieldValue.serverTimestamp(),
//           updatedAt: firestore.FieldValue.serverTimestamp(),
//           recipientName: 'Unknown', // default
//           recipientPhoto: null,
//         });
//       const conversationId = convRef.id;
//       navigation.navigate('Conversation', {conversationId});
//     } catch (error) {
//       console.error('Failed to start conversation:', error);
//     }
//   };

//   const renderItem = ({item}: {item: Contact}) => {
//     const avatarSource = item.base64Photo
//       ? {uri: item.base64Photo}
//       : item.photoURL
//       ? {uri: item.photoURL}
//       : ICONS.avatar;
//     return (
//       <View style={styles.contactRow}>
//         <View style={styles.leftContainer}>
//           <Image source={avatarSource} style={styles.avatar} />
//           <View style={styles.textContainer}>
//             <Text style={styles.name}>{item.displayName || item.email}</Text>
//             <Text style={styles.subtitle}>Life is beautiful 👌</Text>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => handleAddContact(item.uid)}>
//           <Image source={ICONS.addContact} style={styles.addIcon} />
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
//       {contacts.length === 0 ? (
//         <Text>No other users found (or all are in your chat list).</Text>
//       ) : (
//         <FlatList
//           data={contacts}
//           keyExtractor={item => item.uid}
//           renderItem={renderItem}
//         />
//       )}
//     </View>
//   );
// };

// export default Contacts;

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
//   centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     justifyContent: 'space-between',
//   },
//   leftContainer: {flexDirection: 'row', alignItems: 'center'},
//   avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
//   textContainer: {justifyContent: 'center'},
//   name: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
//   subtitle: {fontSize: 14, color: COLORS.textColor, marginTop: 2},
//   addIcon: {width: 24, height: 24, tintColor: COLORS.black},
// });

// src/screens/contacts/Contacts.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {createConversation} from '../../store/slices/chatSlice'; // Import the thunk

interface Contact {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
}

type ContactsNavProp = StackNavigationProp<MainStackParamList, 'Conversation'>;

const Contacts = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ContactsNavProp>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(
        snapshot => {
          const list: Contact[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.uid === user?.uid) return;
            list.push({
              uid: data.uid,
              email: data.email,
              displayName: data.displayName || null,
              photoURL: data.photoURL || null,
              base64Photo: data.base64Photo || null,
            });
          });

          // Build a set of UIDs that are already in a conversation
          const existingContactIds = new Set<string>();
          conversations.forEach(conv => {
            conv.participants.forEach(participantUid => {
              if (participantUid !== user?.uid) {
                existingContactIds.add(participantUid);
              }
            });
          });

          // Filter out contacts already in conversations
          const filteredContacts = list.filter(
            contact => !existingContactIds.has(contact.uid),
          );
          setContacts(filteredContacts);
          setLoading(false);
        },
        error => {
          console.error('Error fetching contacts:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.uid, conversations]);

  // On tapping a contact, create a conversation via the chat slice and navigate to it.
  const handleAddContact = async (otherUid: string) => {
    if (!user?.uid) return;
    try {
      const resultAction = await dispatch(
        createConversation({uid: user.uid, otherUid}),
      );
      if (createConversation.fulfilled.match(resultAction)) {
        const conversationId = resultAction.payload;
        navigation.navigate('Conversation', {conversationId});
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const renderItem = ({item}: {item: Contact}) => {
    const avatarSource = item.base64Photo
      ? {uri: item.base64Photo}
      : item.photoURL
      ? {uri: item.photoURL}
      : ICONS.avatar;
    return (
      <View style={styles.contactRow}>
        <View style={styles.leftContainer}>
          <Image source={avatarSource} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.displayName || item.email}</Text>
            <Text style={styles.subtitle}>Life is beautiful 👌</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleAddContact(item.uid)}>
          <Image source={ICONS.addContact} style={styles.addIcon} />
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
      {contacts.length === 0 ? (
        <Text>No other users found (or all are in your chat list).</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={item => item.uid}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white, padding: 16},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  leftContainer: {flexDirection: 'row', alignItems: 'center'},
  avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  textContainer: {justifyContent: 'center'},
  name: {fontSize: 16, fontWeight: 'bold', color: COLORS.black},
  subtitle: {fontSize: 14, color: COLORS.textColor, marginTop: 2},
  addIcon: {width: 24, height: 24, tintColor: COLORS.black},
});
