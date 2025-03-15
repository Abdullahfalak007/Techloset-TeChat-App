// src/screens/auth/useAuth.ts
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {signInWithGoogle} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import {useEffect} from 'react';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Auth'>;

export const useAuth = () => {
  const navigation = useNavigation<AuthNavigationProp>();
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
      // Navigate to your main screen (ensure that route exists in your navigator)
      navigation.replace('Home'); // Replace 'Home' with the actual route name
    }
  }, [error, user, navigation]);

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleGoogleSignIn = () => {
    // Dispatch the Google sign-in thunk
    dispatch(signInWithGoogle());
  };

  return {
    navigateToLogin,
    handleGoogleSignIn,
    navigateToSignup,
  };
};
