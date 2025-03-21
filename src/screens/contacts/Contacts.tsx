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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';
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

  // --- NEW STATES FOR SEARCH & ADD MODE ---
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

  // --- ON SEARCH ICON PRESSED ---
  const handleSearchPress = () => {
    setShowSearchInput(prev => !prev);
    // Optionally, turn off add buttons when searching
    if (showSearchInput) {
      setSearchTerm('');
    }
  };

  // --- ON ADD ICON PRESSED (Header) ---
  const handleAddPress = () => {
    // Toggle the state that shows add buttons in each contact row.
    setShowAddButtons(prev => !prev);
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
        {showAddButtons && (
          <TouchableOpacity
            onPress={() => handleAddContact(item.uid)}
            style={styles.addButtonContainer}>
            <Image source={ICONS.addContact} style={styles.addIcon} />
          </TouchableOpacity>
        )}
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
          onAddPress={handleAddPress} // Toggling add mode.
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
  addButtonContainer: {
    backgroundColor: COLORS.transparentWhite,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});
