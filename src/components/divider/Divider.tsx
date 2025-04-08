import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../../constants/colors';
import {dividerStyle} from './dividerStyle';
import {DividerProps} from '../../constants/types';

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
