import {useState} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {ForgotPasswordNavigationProp} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {resetPassword} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const useForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handlePasswordReset = async (email: string) => {
    setResetLoading(true);
    try {
      const resultAction = await dispatch(resetPassword({email}));
      if (resetPassword.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Reset Link Sent',
          text2: 'Please check your email and then log in.',
        });
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2:
            (resultAction.payload as string) || 'An unknown error occurred',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message || 'An unknown error occurred',
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    navigation,
    email,
    setEmail,
    handlePasswordReset,
    handleBackToLogin,
    resetLoading,
  };
};
