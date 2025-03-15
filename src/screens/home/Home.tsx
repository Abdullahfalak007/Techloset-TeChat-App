// src/screens/home/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {homeStyle} from '../../styles/homeStyle';
import {useHome} from './useHome';

const Home = () => {
  const {user, loading, handleLogout} = useHome();

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
          <Text style={homeStyle.title}>
            Welcome, {user.displayName || 'No Name'}
          </Text>
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
