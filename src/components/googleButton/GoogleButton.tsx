// src/components/googleButton/GoogleButton.tsx
import React from 'react';
import {TouchableOpacity, Image, StyleSheet, ViewStyle} from 'react-native';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/colors';

interface GoogleButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({onPress, style}) => {
  return (
    <TouchableOpacity style={[styles.googleButton, style]} onPress={onPress}>
      <Image source={ICONS.google} style={styles.googleIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.transparentWhite,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  googleIcon: {
    width: 60,
    height: 60,
  },
});

export default GoogleButton;
