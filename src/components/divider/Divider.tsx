// src/components/divider/Divider.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

interface DividerProps {
  lineColor?: string;
  orTextColor?: string;
}

const Divider: React.FC<DividerProps> = ({
  lineColor = COLORS.subHeadingGrey,
  orTextColor = COLORS.subHeadingGrey,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line, {backgroundColor: lineColor}]} />
      <Text style={[styles.orText, {color: orTextColor}]}>OR</Text>
      <View style={[styles.line, {backgroundColor: lineColor}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default Divider;
