// src/styles/loginStyle.ts
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingHorizontal: 24,
    marginTop: 200,
  },

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
  googleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.transparentWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  googleIcon: {
    width: 60,
    height: 60,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    color: '#666',
    marginHorizontal: 8,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.textColor,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
