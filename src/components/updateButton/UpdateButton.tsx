import React from 'react';
import {Text} from 'react-native';
import GradientButton from '../gradientButton/GradientButton';
import {updateButtonStyles as styles} from './updateButtonStyle';
import {COLORS} from '../../constants/colors';
import Loader from '../loader/Loader';
import {UpdateButtonProps} from '../../constants/types';

const UpdateButton: React.FC<UpdateButtonProps> = ({
  onPress,
  text,
  loading = false,
}) => {
  return (
    <GradientButton
      onPress={onPress}
      containerStyle={styles.button}
      textStyle={styles.buttonText}
      colors={[COLORS.tabBarActiveTintColor, COLORS.tabBarActiveTintColor]}>
      <Text style={styles.buttonText}>{text}</Text>
      {loading && <Loader style={{marginLeft: 10}} />}
    </GradientButton>
  );
};

export default UpdateButton;
