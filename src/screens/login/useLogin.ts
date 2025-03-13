import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const useLogin = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In pressed');
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login pressed with email:', email, 'password:', password);
    // Add your login logic here (e.g., Firebase, API call)
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
