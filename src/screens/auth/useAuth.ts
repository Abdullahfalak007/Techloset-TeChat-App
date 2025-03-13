import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList, 'Auth'>;

export const useAuth = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in logic
    console.log('Google Sign-In Pressed');
  };

  return {
    navigateToLogin,
    handleGoogleSignIn,
  };
};
