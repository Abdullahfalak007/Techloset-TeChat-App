// src/components/divider/Divider.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {dividerStyle} from '../../styles/dividerStyle';

interface DividerProps {
  lineColor?: string;
  orTextColor?: string;
}

const Divider: React.FC<DividerProps> = ({
  lineColor = COLORS.subHeadingGrey,
  orTextColor = COLORS.subHeadingGrey,
}) => {
  return (
    <View style={dividerStyle.container}>
      <View style={[dividerStyle.line, {backgroundColor: lineColor}]} />
      <Text style={[dividerStyle.orText, {color: orTextColor}]}>OR</Text>
      <View style={[dividerStyle.line, {backgroundColor: lineColor}]} />
    </View>
  );
};

export default Divider;
