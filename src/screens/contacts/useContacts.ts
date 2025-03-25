// import {useEffect, useState, useMemo} from 'react';
// import {Keyboard} from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
// import {createConversation} from '../../store/slices/chatSlice';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {MainStackParamList} from '../../constants/types';
// import Toast from 'react-native-toast-message';

// export interface Contact {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   base64Photo: string | null;
// }

// // Utility to group contacts by initial letter.
// export const groupContactsByInitial = (contacts: Contact[]) => {
//   const sorted = [...contacts].sort((a, b) => {
//     const nameA = (a.displayName || a.email).toLowerCase();
//     const nameB = (b.displayName || b.email).toLowerCase();
//     return nameA.localeCompare(nameB);
//   });

//   const map: Record<string, Contact[]> = {};
//   for (const contact of sorted) {
//     const name = contact.displayName || contact.email;
//     const firstLetter = name.charAt(0).toUpperCase();
//     if (!map[firstLetter]) {
//       map[firstLetter] = [];
//     }
//     map[firstLetter].push(contact);
//   }

//   return Object.keys(map)
//     .sort()
//     .map(letter => ({
//       title: letter,
//       data: map[letter],
//     }));
// };

// type ContactsNavProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

// export const useContacts = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const {conversations} = useAppSelector(state => state.chat);
//   const dispatch = useAppDispatch();
//   const navigation = useNavigation<ContactsNavProp>();

//   // Store all contacts fetched from Firestore.
//   const [allContacts, setAllContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);

//   // States for search & add mode.
//   const [showSearchInput, setShowSearchInput] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddButtons, setShowAddButtons] = useState(false);

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('users')
//       .onSnapshot(
//         snapshot => {
//           const list: Contact[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             if (data.uid === user?.uid) return;
//             list.push({
//               uid: data.uid,
//               email: data.email,
//               displayName: data.displayName || null,
//               photoURL: data.photoURL || null,
//               base64Photo: data.base64Photo || null,
//             });
//           });
//           setAllContacts(list);
//           setLoading(false);
//         },
//         error => {
//           console.error('Error fetching contacts:', error);
//           setLoading(false);
//         },
//       );

//     return () => unsubscribe();
//   }, [user?.uid]);

//   // Derive filtered contacts from raw contacts and conversations.
//   const filteredContacts = useMemo(() => {
//     const existingContactIds = new Set<string>();
//     conversations.forEach(conv => {
//       conv.participants.forEach(participantUid => {
//         if (participantUid !== user?.uid) {
//           existingContactIds.add(participantUid);
//         }
//       });
//     });
//     const filtered = allContacts.filter(
//       contact => !existingContactIds.has(contact.uid),
//     );
//     return searchTerm
//       ? filtered.filter(c => {
//           const name = (c.displayName || c.email).toLowerCase();
//           return name.includes(searchTerm.toLowerCase());
//         })
//       : filtered;
//   }, [allContacts, conversations, searchTerm, user]);

//   const handleAddContact = async (otherUid: string) => {
//     if (!user?.uid) return;
//     try {
//       const resultAction = await dispatch(
//         createConversation({uid: user.uid, otherUid}),
//       );
//       if (createConversation.fulfilled.match(resultAction)) {
//         Toast.show({type: 'success', text1: 'Conversation created!'});
//         // No need to manually remove the contact;
//         // the useMemo will recalculate filteredContacts once conversations update.
//       }
//     } catch (error) {
//       console.error('Failed to start conversation:', error);
//     }
//   };

//   const handleSearchPress = () => {
//     setShowSearchInput(prev => !prev);
//     if (showSearchInput) {
//       setSearchTerm('');
//     }
//   };

//   const handleAddPress = () => {
//     setShowAddButtons(prev => !prev);
//   };

//   const dismissKeyboard = () => {
//     if (showSearchInput) {
//       setShowSearchInput(false);
//       setSearchTerm('');
//       Keyboard.dismiss();
//     }
//   };

//   const sections = useMemo(
//     () => groupContactsByInitial(filteredContacts),
//     [filteredContacts],
//   );

//   return {
//     loading,
//     navigation,
//     user,
//     sections,
//     searchTerm,
//     setSearchTerm,
//     showSearchInput,
//     handleSearchPress,
//     showAddButtons,
//     handleAddPress,
//     handleAddContact,
//     dismissKeyboard,
//   };
// };

// src/hooks/useContacts.ts
import {useEffect, useState, useMemo} from 'react';
import {Keyboard} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {createConversation} from '../../store/slices/chatSlice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';
import Toast from 'react-native-toast-message';

export interface Contact {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
}

export const groupContactsByInitial = (contacts: Contact[]) => {
  const sorted = [...contacts].sort((a, b) => {
    const nameA = (a.displayName || a.email).toLowerCase();
    const nameB = (b.displayName || b.email).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const map: Record<string, Contact[]> = {};
  for (const contact of sorted) {
    const name = contact.displayName || contact.email;
    const firstLetter = name.charAt(0).toUpperCase();
    if (!map[firstLetter]) {
      map[firstLetter] = [];
    }
    map[firstLetter].push(contact);
  }

  return Object.keys(map)
    .sort()
    .map(letter => ({
      title: letter,
      data: map[letter],
    }));
};

type ContactsNavProp = StackNavigationProp<MainStackParamList, 'MainTabs'>;

export const useContacts = () => {
  const {user} = useAppSelector(state => state.auth);
  const {conversations} = useAppSelector(state => state.chat);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ContactsNavProp>();

  // Store all contacts fetched from Firestore.
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // States for search & add mode.
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddButtons, setShowAddButtons] = useState(false);

  // New state to track which contacts are being added.
  const [addingContacts, setAddingContacts] = useState<Set<string>>(new Set());

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
          setAllContacts(list);
          setLoading(false);
        },
        error => {
          console.error('Error fetching contacts:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.uid]);

  // Derive filtered contacts from raw contacts and conversations.
  const filteredContacts = useMemo(() => {
    const existingContactIds = new Set<string>();
    conversations.forEach(conv => {
      conv.participants.forEach(participantUid => {
        if (participantUid !== user?.uid) {
          existingContactIds.add(participantUid);
        }
      });
    });
    const filtered = allContacts.filter(
      contact => !existingContactIds.has(contact.uid),
    );
    return searchTerm
      ? filtered.filter(c => {
          const name = (c.displayName || c.email).toLowerCase();
          return name.includes(searchTerm.toLowerCase());
        })
      : filtered;
  }, [allContacts, conversations, searchTerm, user]);

  const handleAddContact = async (otherUid: string) => {
    if (!user?.uid) return;
    // Mark this contact as being added.
    setAddingContacts(prev => new Set(prev).add(otherUid));
    try {
      const resultAction = await dispatch(
        createConversation({uid: user.uid, otherUid}),
      );
      if (createConversation.fulfilled.match(resultAction)) {
        Toast.show({type: 'success', text1: 'Conversation created!'});
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      // Remove the contact from the adding set regardless of success/failure.
      setAddingContacts(prev => {
        const newSet = new Set(prev);
        newSet.delete(otherUid);
        return newSet;
      });
    }
  };

  const handleSearchPress = () => {
    setShowSearchInput(prev => !prev);
    if (showSearchInput) {
      setSearchTerm('');
    }
  };

  const handleAddPress = () => {
    setShowAddButtons(prev => !prev);
  };

  const dismissKeyboard = () => {
    if (showSearchInput) {
      setShowSearchInput(false);
      setSearchTerm('');
      Keyboard.dismiss();
    }
  };

  const sections = useMemo(
    () => groupContactsByInitial(filteredContacts),
    [filteredContacts],
  );

  return {
    loading,
    navigation,
    user,
    sections,
    searchTerm,
    setSearchTerm,
    showSearchInput,
    handleSearchPress,
    showAddButtons,
    handleAddPress,
    handleAddContact,
    dismissKeyboard,
    addingContacts, // expose this set for UI use
  };
};
