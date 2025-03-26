import React from 'react';
import {Text} from 'react-native';
import GradientButton from '../gradientButton/GradientButton';
import {updateButtonStyles as styles} from '../../styles/updateButtonStyle';
import {COLORS} from '../../constants/colors';
import Loader from '../loader/Loader';

interface UpdateButtonProps {
  onPress: () => void;
  text: string;
  loading?: boolean;
}

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
      {loading && <Loader style={{marginRight: 8}} />}
    </GradientButton>
  );
};

export default UpdateButton;
