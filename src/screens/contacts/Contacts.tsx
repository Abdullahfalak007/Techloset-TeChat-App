// src/screens/contacts/Contacts.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useAppSelector} from '../../hooks/useStore';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../constants/types';
import {COLORS} from '../../constants/colors';

// The type for your contact user object
interface Contact {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
}

// If your MainStack has a route named "Conversation",
// or "ChatListScreen" etc., adjust accordingly
type ContactsNavProp = StackNavigationProp<MainStackParamList, 'Conversation'>;

const Contacts = () => {
  const {user} = useAppSelector(state => state.auth); // from your auth slice
  const navigation = useNavigation<ContactsNavProp>();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all user docs in Firestore's "users" collection
    // except the current user
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const list: Contact[] = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              // Filter out the current user
              if (data.uid !== user?.uid) {
                list.push({
                  uid: data.uid,
                  email: data.email,
                  displayName: data.displayName || null,
                  photoURL: data.photoURL || null,
                  base64Photo: data.base64Photo || null,
                });
              }
            });
            setContacts(list);
          } else {
            setContacts([]);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching users:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [user?.uid]);

  // Called when user taps on a contact to start a conversation
  const handleStartChat = async (otherUid: string) => {
    if (!user?.uid) return;
    try {
      // Create a conversation doc with participants
      const conversationRef = await firestore()
        .collection('conversations')
        .add({
          participants: [user.uid, otherUid],
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      const conversationId = conversationRef.id;

      // Navigate to your Conversation screen
      navigation.navigate('Conversation', {conversationId});
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No other users found.</Text>
      </View>
    );
  }

  const renderItem = ({item}: {item: Contact}) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleStartChat(item.uid)}>
      <Text style={styles.name}>{item.displayName || item.email}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  email: {
    fontSize: 14,
    color: COLORS.textColor,
    marginTop: 2,
  },
});
