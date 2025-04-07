import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenNavigationProp} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {loginWithEmail, loginWithGoogle} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const useLogin = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await dispatch(loginWithGoogle());
    } catch (error) {
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1:
          !email && !password
            ? 'Please enter your credentials!'
            : !email
            ? 'Please enter your email!'
            : 'Please enter your password!',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setLoginLoading(true);
    try {
      await dispatch(loginWithEmail({email, password})).unwrap();
    } catch (error: any) {
      if (
        error &&
        typeof error === 'string' &&
        error.toLowerCase().includes('wrong-password')
      ) {
        Toast.show({
          type: 'error',
          text1: 'Wrong Password',
          text2: 'Your password is incorrect.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error || 'An unknown error occurred.',
        });
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return {
    navigation,
    handleGoogleSignIn,
    handleLogin,
    handleForgotPassword,
    loginLoading,
    googleLoading,
  };
};
