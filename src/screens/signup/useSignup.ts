import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SignupScreenNavigationProp} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {signOut, signupWithEmail} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';

export const useSignup = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [signupLoading, setSignupLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Invalid email address');
      return;
    } else {
      setEmailError(null);
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    setSignupLoading(true);
    try {
      const resultAction = await dispatch(
        signupWithEmail({email, password, name}),
      );
      if (signupWithEmail.fulfilled.match(resultAction)) {
        dispatch(signOut());
        navigation.replace('Login');
        Toast.show({
          type: 'success',
          text1: 'Signup Successful',
          text2: 'Please log in with your credentials',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2:
            (resultAction.payload as string) || 'An unknown error occurred',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message || 'An unknown error occurred',
      });
    } finally {
      setSignupLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSignup,
    signupLoading,
    navigation,
  };
};
