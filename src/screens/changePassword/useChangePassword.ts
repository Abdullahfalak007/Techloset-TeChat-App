import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../constants/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {changeUserPassword} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const useChangePassword = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const {loading} = useAppSelector(state => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all the fields.',
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Please ensure the new passwords match.',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password too short',
        text2: 'Password must be at least 6 characters.',
      });
      return;
    }

    try {
      await dispatch(
        changeUserPassword({currentPassword, newPassword}),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your password has been changed successfully.',
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Update Password',
        text2: error || 'An unknown error occurred.',
      });
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    handleUpdatePassword,
    loading,
    navigation,
  };
};
