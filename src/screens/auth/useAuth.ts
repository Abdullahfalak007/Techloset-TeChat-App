// src/screens/auth/useAuth.ts
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthNavigationProp} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {signupWithGoogle} from '../../store/slices/authSlice';

export const useAuth = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const dispatch = useAppDispatch();

  // Local loading for the Google sign-up
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await dispatch(signupWithGoogle());
    } catch (error) {
      // Handled in thunk
    } finally {
      setGoogleLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return {
    navigateToLogin,
    handleGoogleSignUp,
    navigateToSignup,
    handleForgotPassword,
    googleLoading,
  };
};
