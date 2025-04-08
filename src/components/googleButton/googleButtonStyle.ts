import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const googleButtonStyle = StyleSheet.create({
  googleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.transparentWhite,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  googleIcon: {
    width: 60,
    height: 60,
  },
});
