// src/screens/login/useLogin.ts
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {loginWithEmail, loginWithGoogle} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const useLogin = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();

  // Local states for each button
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await dispatch(loginWithGoogle());
    } catch (error) {
      // Thunk handles error via Toast
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
    setLoginLoading(true);
    try {
      await dispatch(loginWithEmail({email, password}));
    } catch (error) {
      // Thunk handles error via Toast
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
