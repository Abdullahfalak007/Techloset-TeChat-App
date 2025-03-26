// src/components/googleButton/GoogleButton.tsx
import React from 'react';
import {TouchableOpacity, Image, StyleSheet, ViewStyle} from 'react-native';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/colors';
import Loader from '../loader/Loader';
import {googleButtonStyle} from '../../styles/googleButtonStyle';

interface GoogleButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  loading?: boolean; // Add loading prop
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  style,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[googleButtonStyle.googleButton, style]}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <Loader />
      ) : (
        <Image source={ICONS.google} style={googleButtonStyle.googleIcon} />
      )}
    </TouchableOpacity>
  );
};

export default GoogleButton;
