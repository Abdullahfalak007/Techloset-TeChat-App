import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

export const useSignup = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();

  // Dynamic local states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Basic validation logic (placeholder)
  const handleSignup = () => {
    // Example email validation (very simple)
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('invalid email address');
      return;
    } else {
      setEmailError(null);
    }

    // Check password match
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    console.log('Signup pressed with:', {
      name,
      email,
      password,
      confirmPassword,
    });
    // TODO: Perform actual signup logic here (e.g., Firebase or API call)
  };

  return {
    navigation,
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
  };
};
