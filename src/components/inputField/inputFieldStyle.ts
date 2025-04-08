import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const inputFieldStyle = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.black,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});
