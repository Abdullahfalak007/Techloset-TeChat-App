import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const forgotPasswordStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {marginLeft: 8},

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: COLORS.subHeadingGrey,
    marginBottom: 24,
    textAlign: 'center',
  },
  bottomContainer: {
    margin: 20,
  },
});
