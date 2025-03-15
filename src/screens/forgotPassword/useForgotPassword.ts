// src/screens/forgotPassword/useForgotPassword.ts
import {useState} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {resetPassword} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

type ForgotPasswordNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export const useForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');

  const handlePasswordReset = async (email: string) => {
    try {
      const resultAction = await dispatch(resetPassword({email}));
      if (resetPassword.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Reset Link Sent',
          text2: 'Please check your email and then log in.',
        });
        // Wait a short moment before navigating
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        }, 1000); // 1 second delay (adjust if needed)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2:
            (resultAction.payload as string) || 'An unknown error occurred',
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message || 'An unknown error occurred',
      });
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
  };
};
