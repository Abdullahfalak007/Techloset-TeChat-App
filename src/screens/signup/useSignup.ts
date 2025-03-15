// // src/screens/signup/useSignup.ts
// import {useEffect, useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {AuthStackParamList} from '../../constants/types';
// import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
// import {signupWithEmail} from '../../store/slices/authSlice';
// import Toast from 'react-native-toast-message';

// type SignupScreenNavigationProp = StackNavigationProp<
//   AuthStackParamList,
//   'Signup'
// >;

// export const useSignup = () => {
//   const navigation = useNavigation<SignupScreenNavigationProp>();
//   const dispatch = useAppDispatch();

//   // Local states for input fields
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const {user, error} = useAppSelector(state => state.auth);

//   useEffect(() => {
//     if (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Signup Failed',
//         text2: error,
//       });
//     }
//     if (user) {
//       Toast.show({
//         type: 'success',
//         text1: 'Signup Successful',
//       });
//       // Navigate to your main screen
//       navigation.replace('Home'); // Replace 'Home' with the actual route name
//     }
//   }, [error, user, navigation]);

//   const handleSignup = () => {
//     // Basic email validation
//     if (!email.includes('@') || !email.includes('.')) {
//       setEmailError('Invalid email address');
//       return;
//     } else {
//       setEmailError(null);
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Passwords do not match',
//       });
//       return;
//     }

//     // Dispatch the signup action
//     dispatch(signupWithEmail({email, password, name}));
//   };

//   return {
//     navigation,
//     name,
//     setName,
//     email,
//     setEmail,
//     emailError,
//     password,
//     setPassword,
//     confirmPassword,
//     setConfirmPassword,
//     handleSignup,
//   };
// };

// src/screens/signup/useSignup.ts
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch} from '../../hooks/useStore';
import {signupWithEmail} from '../../store/slices/authSlice';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

export const useSignup = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const dispatch = useAppDispatch();

  // Local states for input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Invalid email address');
      return;
    } else {
      setEmailError(null);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      const resultAction = await dispatch(
        signupWithEmail({email, password, name}),
      );

      if (signupWithEmail.fulfilled.match(resultAction)) {
        // Immediately sign out the newly created user
        await auth().signOut();

        // Navigate to the Login screen
        navigation.navigate('Login');

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
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message || 'An unknown error occurred',
      });
    }
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
