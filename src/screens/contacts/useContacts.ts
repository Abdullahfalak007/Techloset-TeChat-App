import {useEffect, useState, useMemo} from 'react';
import {Keyboard} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {createConversation} from '../../store/slices/chatSlice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Contact, MainStackParamList} from '../../constants/types';
import Toast from 'react-native-toast-message';

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

  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddButtons, setShowAddButtons] = useState(false);

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
    addingContacts,
  };
};
