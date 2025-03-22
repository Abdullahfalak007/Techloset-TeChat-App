// src/screens/profile/Profile.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {setUser} from '../../store/slices/authSlice';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../constants/types';
import {useNavigation} from '@react-navigation/native';

const Profile: React.FC = () => {
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [status, setStatus] = useState(user?.status || '');

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // On mount, if Firestore doesn't have a photoURL, update it with Firebase Auth's photoURL.
  useEffect(() => {
    const updatePhotoURLIfNeeded = async () => {
      if (user && !user.photoURL) {
        const currentAuthUser = auth().currentUser;
        if (currentAuthUser?.photoURL) {
          try {
            await firestore()
              .collection('users')
              .doc(user.uid)
              .set({photoURL: currentAuthUser.photoURL}, {merge: true});
            dispatch(setUser({...user, photoURL: currentAuthUser.photoURL}));
          } catch (error) {
            console.error('Error updating photoURL in Firestore:', error);
          }
        }
      }
    };
    updatePhotoURLIfNeeded();
  }, [user, dispatch]);

  // Handle updating profile details (name, email, status)
  const handleUpdateProfile = async () => {
    if (!user?.uid) return;
    try {
      await firestore().collection('users').doc(user.uid).update({
        displayName,
        email,
        status,
      });
      dispatch(setUser({...user, displayName, email, status}));
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'An error occurred while updating your profile.',
      });
      console.error('Error updating profile:', error);
    }
  };

  // Handle editing the avatar: pick an image, convert it to base64, and update Firestore
  const handleEditAvatar = async () => {
    if (!user?.uid) return;
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) return;
      const asset = result.assets && result.assets[0];
      if (asset && asset.base64 && asset.type) {
        const base64Image = `data:${asset.type};base64,${asset.base64}`;
        await firestore().collection('users').doc(user.uid).update({
          photoURL: base64Image,
        });
        dispatch(setUser({...user, photoURL: base64Image}));
        Toast.show({
          type: 'success',
          text1: 'Profile Image Updated',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: 'Selected image did not return valid data.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Unable to update avatar.',
      });
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <GradientHeader
        title="Profile"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Avatar with Edit Icon */}
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{uri: user.photoURL}} style={styles.avatar} />
          ) : (
            <Image source={ICONS.avatar} style={styles.avatar} />
          )}
          <TouchableOpacity
            style={styles.editIconWrapper}
            onPress={handleEditAvatar}>
            <Image source={ICONS.edit} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Your name</Text>
          <TextInput
            style={styles.valueInput}
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        {/* Email */}
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Your email</Text>
          <TextInput
            style={styles.valueInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Status */}
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Your status</Text>
          <TextInput
            style={styles.valueInput}
            value={status}
            onChangeText={setStatus}
          />
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white},
  headerContainer: {
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {color: COLORS.white, fontSize: 20, fontWeight: 'bold'},
  contentContainer: {
    flex: 1,
    marginTop: -20,
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  avatarContainer: {position: 'relative', marginBottom: 24},
  avatar: {width: 120, height: 120, borderRadius: 60},
  editIconWrapper: {
    position: 'absolute',
    bottom: 3,
    right: 10,
    backgroundColor: COLORS.tabBarActiveTintColor,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {width: 16, height: 16},
  infoGroup: {width: '100%', marginBottom: 16},
  label: {
    fontSize: 14,
    color: COLORS.tabBarActiveTintColor,
    fontWeight: '500',
    marginBottom: 4,
  },
  valueInput: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '400',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyTextSubtitle,
    paddingBottom: 8,
  },
  updateButton: {
    marginTop: 40,
    width: '100%',
    backgroundColor: COLORS.tabBarActiveTintColor,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {color: COLORS.white, fontSize: 16, fontWeight: 'bold'},
});
