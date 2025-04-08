import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const backButtonStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});
