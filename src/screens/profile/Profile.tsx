// src/screens/profile/Profile.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const Profile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Profile screen!</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: COLORS.black,
  },
});
