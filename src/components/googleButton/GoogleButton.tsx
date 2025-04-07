import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {ICONS} from '../../constants/icons';
import Loader from '../loader/Loader';
import {googleButtonStyle} from '../../styles/googleButtonStyle';
import {GoogleButtonProps} from '../../constants/types';

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
