// src/components/gradientButton/GradientButton.tsx
import React, {FC} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {gradientButtonStyle} from '../../styles/gradientButtonStyle';
import {GradientButtonProps} from '../../constants/types';

const GradientButton: FC<GradientButtonProps> = ({
  onPress,
  text,
  children,
  containerStyle,
  textStyle,
  colors = [COLORS.gradientStart, COLORS.gradientEnd],
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 0}}
      style={[gradientButtonStyle.gradientButton, containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={gradientButtonStyle.buttonContent}>
        {children ? (
          children
        ) : (
          <Text style={[gradientButtonStyle.buttonText, textStyle]}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default GradientButton;
