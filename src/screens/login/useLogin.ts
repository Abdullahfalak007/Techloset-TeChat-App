// src/screens/login/useLogin.ts
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {loginWithEmail, loginWithGoogle} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const useLogin = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const {user, error} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error,
      });
    }
    if (user) {
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });
    }
  }, [error, user, navigation]);

  const handleGoogleSignIn = () => {
    dispatch(loginWithGoogle());
  };

  const handleLogin = (email: string, password: string) => {
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
    } else {
      dispatch(loginWithEmail({email, password}));
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
  };
};
