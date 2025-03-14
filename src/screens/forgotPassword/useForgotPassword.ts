// import {useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {AuthStackParamList} from '../../constants/types';

// type ForgotPasswordNavigationProp = StackNavigationProp<
//   AuthStackParamList,
//   'ForgotPassword'
// >;

// export const useForgotPassword = () => {
//   const navigation = useNavigation<ForgotPasswordNavigationProp>();
//   const [email, setEmail] = useState('');

//   const handlePasswordReset = (email: string) => {
//     console.log('Password reset requested for email:', email);
//     // TODO: Implement password reset logic (API, Firebase, etc.)
//   };

//   const handleBackToLogin = () => {
//     navigation.navigate('Login');
//   };

//   return {
//     navigation,
//     email,
//     setEmail,
//     handlePasswordReset,
//     handleBackToLogin,
//   };
// };

// src/screens/forgotPassword/useForgotPassword.ts
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {resetPassword} from '../../store/slices/authSlice';

type ForgotPasswordNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

export const useForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');

  const handlePasswordReset = (email: string) => {
    dispatch(resetPassword({email}));
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    navigation,
    email,
    setEmail,
    handlePasswordReset,
    handleBackToLogin,
  };
};
