import {useEffect, useState, useMemo} from 'react';
import {Keyboard} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {createConversation} from '../../store/slices/chatSlice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';

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

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW STATES FOR SEARCH & ADD MODE
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddButtons, setShowAddButtons] = useState(false);

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

  const filteredContacts = searchTerm
    ? contacts.filter(c => {
        const name = (c.displayName || c.email).toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      })
    : contacts;

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
  };
};
