// // src/screens/contacts/Contacts.tsx
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Image,
//   SectionList,
//   TextInput,
//   Alert,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {MainStackParamList} from '../../constants/types';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';
// import {createConversation} from '../../store/slices/chatSlice';
// import GradientHeader from '../../components/gradientHeader/GradientHeader';
// import {groupContactsByInitial} from './useContacts';

// export interface Contact {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   base64Photo: string | null;
// }

// // If you want to navigate to MainTabs container
// type ContactsNavProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

// const Contacts = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const {conversations} = useAppSelector(state => state.chat);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<ContactsNavProp>();

//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- NEW STATES FOR SEARCH ---
//   const [showSearchInput, setShowSearchInput] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchText, setSearchText] = useState('');

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('users')
//       .onSnapshot(
//         snapshot => {
//           const list: Contact[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             // Skip the current user
//             if (data.uid === user?.uid) return;
//             list.push({
//               uid: data.uid,
//               email: data.email,
//               displayName: data.displayName || null,
//               photoURL: data.photoURL || null,
//               base64Photo: data.base64Photo || null,
//             });
//           });

//           // Build a set of UIDs that already have a conversation with the current user
//           const existingContactIds = new Set<string>();
//           conversations.forEach(conv => {
//             conv.participants.forEach(participantUid => {
//               if (participantUid !== user?.uid) {
//                 existingContactIds.add(participantUid);
//               }
//             });
//           });

//           // Filter out contacts that are already in a conversation
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

//   // When user taps a contact row
//   const handleAddContact = async (otherUid: string) => {
//     if (!user?.uid) return;
//     try {
//       const resultAction = await dispatch(
//         createConversation({uid: user.uid, otherUid}),
//       );
//       if (createConversation.fulfilled.match(resultAction)) {
//         navigation.navigate('MainTabs');
//       }
//     } catch (error) {
//       console.error('Failed to start conversation:', error);
//     }
//   };

//   // --- ON SEARCH ICON PRESSED ---
//   const handleSearchPress = () => {
//     // Toggle the search input
//     setShowSearchInput(prev => !prev);
//     // Clear the search term if turning off
//     if (showSearchInput) {
//       setSearchTerm('');
//     }
//   };

//   // --- ON ADD ICON PRESSED ---
//   const handleAddPress = () => {
//     // For now, just show an alert or console log
//     Alert.alert('Add Pressed', 'Implement your custom logic here!');
//     // e.g. navigate to a “Create Contact” screen or something else
//   };

//   // Render each contact item
//   const renderContactItem = ({item}: {item: Contact}) => {
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

//   // Render the section header for each letter
//   const renderSectionHeader = ({section}: any) => {
//     return <Text style={styles.sectionHeader}>{section.title}</Text>;
//   };

//   // If loading data
//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={COLORS.black} />
//       </View>
//     );
//   }

//   // 1) Filter contacts if searchTerm is non-empty
//   const filtered = searchTerm
//     ? contacts.filter(c => {
//         const name = (c.displayName || c.email).toLowerCase();
//         return name.includes(searchTerm.toLowerCase());
//       })
//     : contacts;

//   // 2) Group the (filtered) contacts by first letter
//   const sections = groupContactsByInitial(filtered);

//   return (
//     <View style={{flex: 1}}>
//       {/*
//         Pass isContactsScreen=true to show the search & add icons.
//         Also pass onSearchPress and onAddPress.
//       */}
//       <GradientHeader
//         title="Contacts"
//         isContactsScreen
//         onSearch={query => {
//           // Implement your search filtering logic here
//           console.log('Search query:', query);
//         }}
//         onAdd={() => {
//           // Implement your add-contact logic here if needed
//           console.log('Add pressed');
//         }}
//       />

//       {/*
//         If showSearchInput is true, show a text input
//         for user to type the search term.
//       */}
//       {showSearchInput && (
//         <View style={styles.searchContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search contacts..."
//             placeholderTextColor="#999"
//             value={searchTerm}
//             onChangeText={setSearchTerm}
//           />
//         </View>
//       )}

//       <View style={styles.roundedContainer}>
//         {sections.length === 0 ? (
//           <Text>No other users found (or all are in your chat list).</Text>
//         ) : (
//           <SectionList
//             sections={sections}
//             keyExtractor={item => item.uid}
//             renderItem={renderContactItem}
//             renderSectionHeader={renderSectionHeader}
//             // “My Contact” label at the top
//             ListHeaderComponent={() => (
//               <Text style={styles.myContactLabel}>My Contact</Text>
//             )}
//             stickySectionHeadersEnabled={false}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default Contacts;

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // The container below the gradient header
//   roundedContainer: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     marginTop: -20, // Overlap the gradient
//     padding: 16,
//   },
//   myContactLabel: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginVertical: 8,
//     color: COLORS.black,
//   },
//   sectionHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.black,
//     marginTop: 16,
//     marginBottom: 4,
//   },
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

//   // Search bar area
//   searchContainer: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   searchInput: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 16,
//     color: COLORS.black,
//   },
// });
// src/screens/contacts/Contacts.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SectionList,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {createConversation} from '../../store/slices/chatSlice';
import GradientHeader from '../../components/gradientHeader/GradientHeader';

import {groupContactsByInitial} from './useContacts';

export interface Contact {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
}

type ContactsNavProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

const Contacts = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ContactsNavProp>();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR SEARCH ---
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

          const existingContactIds = new Set<string>();
          conversations.forEach(conv => {
            conv.participants.forEach(participantUid => {
              if (participantUid !== user?.uid) {
                existingContactIds.add(participantUid);
              }
            });
          });

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

  const handleAddContact = async (otherUid: string) => {
    if (!user?.uid) return;
    try {
      const resultAction = await dispatch(
        createConversation({uid: user.uid, otherUid}),
      );
      if (createConversation.fulfilled.match(resultAction)) {
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  // --- ON SEARCH ICON PRESSED ---
  const handleSearchPress = () => {
    setShowSearchInput(prev => !prev);
    if (showSearchInput) {
      setSearchTerm('');
    }
  };

  // --- ON ADD ICON PRESSED ---
  const handleAddPress = () => {
    Alert.alert('Add Pressed', 'Implement your custom logic here!');
  };

  const renderContactItem = ({item}: {item: Contact}) => {
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

  const renderSectionHeader = ({section}: any) => {
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  const filtered = searchTerm
    ? contacts.filter(c => {
        const name = (c.displayName || c.email).toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      })
    : contacts;

  const sections = groupContactsByInitial(filtered);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (showSearchInput) {
          setShowSearchInput(false);
          setSearchTerm('');
          Keyboard.dismiss();
        }
      }}>
      <View style={{flex: 1}}>
        <GradientHeader
          title="Contacts"
          isContactsScreen
          searchActive={showSearchInput}
          searchValue={searchTerm}
          onChangeSearch={setSearchTerm}
          onSearchPress={handleSearchPress}
          onAddPress={handleAddPress} // if needed
        />

        {/* The contacts list */}
        <View style={styles.roundedContainer}>
          {sections.length === 0 ? (
            <Text>No other users found (or all are in your chat list).</Text>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={item => item.uid}
              renderItem={renderContactItem}
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={() => (
                <Text style={styles.myContactLabel}>My Contact</Text>
              )}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 16,
  },
  myContactLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: COLORS.black,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textColor,
    marginTop: 2,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});
