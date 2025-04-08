import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const updateButtonStyles = StyleSheet.create({
  button: {
    marginTop: 40,
    width: '100%',
    backgroundColor: COLORS.tabBarActiveTintColor,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
