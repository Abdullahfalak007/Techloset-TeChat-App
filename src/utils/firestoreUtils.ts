// src/utils/firestoreUtils.ts
import firestore from '@react-native-firebase/firestore';
import {User} from '../store/slices/authSlice';

export const updateUserDocument = async (user: User) => {
  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set(user, {merge: true});
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

export const fetchUserStatus = async (uid: string): Promise<string> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    return doc.exists
      ? doc.data()?.status || 'No Status Added Yet'
      : 'No Status Added Yet';
  } catch (error) {
    console.error('Error fetching user status:', error);
    return 'No Status Added Yet';
  }
};

export const getRecipientInfo = async (uid: string) => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (!doc.exists) return {name: 'Unknown', photo: null};

    const data = doc.data();
    return {
      name: data?.displayName || data?.email || 'Unknown',
      photo: data?.photoURL || null,
    };
  } catch (error) {
    console.error('Error fetching recipient info:', error);
    return {name: 'Unknown', photo: null};
  }
};
