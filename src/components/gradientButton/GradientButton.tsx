// src/components/gradientButton/GradientButton.tsx
import React, {FC} from 'react';
import {TouchableOpacity, Text, ViewStyle, TextStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {gradientButtonStyle} from '../../styles/gradientButtonStyle';

interface GradientButtonProps {
  onPress: () => void;
  text?: string;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
}

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
