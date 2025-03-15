// src/screens/home/HomeScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useAppDispatch} from '../../hooks/useStore';
import {signOut} from '../../store/slices/authSlice';
import Toast from 'react-native-toast-message';
import {homeStyle} from '../../styles/homeStyle';

const Home = ({navigation}: {navigation: any}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      dispatch(signOut());
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
      });
      navigation.navigate('Auth'); // Navigate back to Auth screen
    } catch (error: any) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error.message || 'An error occurred during logout',
      });
    }
  };

  if (loading) {
    return (
      <View style={homeStyle.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={homeStyle.container}>
      {user ? (
        <>
          <Text style={homeStyle.title}>Welcome, {user.displayName}</Text>
          <Text style={homeStyle.email}>Email: {user.email}</Text>
          {user.photoURL ? (
            <Image style={homeStyle.image} source={{uri: user.photoURL}} />
          ) : (
            <Text>No profile image available.</Text>
          )}
          <TouchableOpacity
            onPress={handleLogout}
            style={homeStyle.logoutButton}>
            <Text style={homeStyle.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>User not logged in.</Text>
      )}
    </View>
  );
};

export default Home;
