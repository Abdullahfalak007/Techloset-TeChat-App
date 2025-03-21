// src/screens/auth/useAuth.ts
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {signupWithGoogle} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Auth'>;

export const useAuth = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const dispatch = useAppDispatch();
  const {user, error} = useAppSelector(state => state.auth);

  if (error) {
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: error,
    });
  }

  // Add these functions so they can be used in your Auth screen:
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  const handleGoogleSignUp = () => {
    dispatch(signupWithGoogle());
  };

  // You can add handleLogin here if needed.
  const handleLogin = (email: string, password: string) => {
    // Implement your email login dispatch here if needed.
  };

  return {
    navigation,
    handleGoogleSignUp,
    handleLogin,
    handleForgotPassword,
    navigateToLogin,
    navigateToSignup,
  };
};
