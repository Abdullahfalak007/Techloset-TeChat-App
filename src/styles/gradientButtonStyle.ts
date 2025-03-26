import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const gradientButtonStyle = StyleSheet.create({
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row', // so text and loader can be in a row
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
