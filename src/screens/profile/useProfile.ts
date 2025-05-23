import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../constants/types';
import {useAppSelector, useAppDispatch} from '../../hooks/useStore';
import {setUser} from '../../store/slices/authSlice';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import {useImagePicker} from '../../utils/useImagePicker';

export const useProfile = () => {
  const {user} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [status, setStatus] = useState(user?.status || '');
  const [updating, setUpdating] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {pickImage} = useImagePicker();

  useEffect(() => {
    const updatePhotoURLIfNeeded = async () => {
      if (user && !user.photoURL) {
        const currentAuthUser = auth().currentUser;
        if (currentAuthUser?.photoURL) {
          try {
            await firestore()
              .collection('users')
              .doc(user.uid)
              .set({photoURL: currentAuthUser?.photoURL}, {merge: true});
            dispatch(setUser({...user, photoURL: currentAuthUser?.photoURL}));
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(
                'Error updating photoURL in Firestore:',
                error.message,
              );
            } else {
              console.error('Error updating photoURL in Firestore:', error);
            }
          }
        }
      }
    };
    updatePhotoURLIfNeeded();
  }, [user]);

  const handleUpdateProfile = async (): Promise<void> => {
    if (!user?.uid) return;
    if (!displayName?.trim() || !email?.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name and email cannot be empty.',
      });
      return;
    }
    setUpdating(true);
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2:
            error.message || 'An error occurred while updating your profile.',
        });
      }
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEditAvatar = async (): Promise<void> => {
    if (!user?.uid) return;
    try {
      const asset = await pickImage({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (!asset) return;
      if (asset.base64 && asset.type) {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: 'Unable to update avatar.',
        });
      }
      console.error('Error updating avatar:', error);
    }
  };

  return {
    user,
    displayName,
    setDisplayName,
    email,
    setEmail,
    status,
    setStatus,
    handleUpdateProfile,
    handleEditAvatar,
    navigation,
    updating,
  };
};
