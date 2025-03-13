import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gradientStart, // Or any background color of your choice
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.signupButtonBackground,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.white,
  },
});
