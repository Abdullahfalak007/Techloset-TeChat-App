// src/screens/home/useHome.ts
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../constants/types';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {signOut} from '../../store/slices/authSlice';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

type HomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Home'>;

export const useHome = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user, loading} = useAppSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      dispatch(signOut());
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
      });
      navigation.navigate('Auth'); // 'Auth' is now recognized as valid
    } catch (error: any) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.message || 'An error occurred during logout',
      });
    }
  };

  return {
    user,
    loading,
    handleLogout,
  };
};
