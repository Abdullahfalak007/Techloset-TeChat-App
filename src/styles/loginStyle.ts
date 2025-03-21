// src/styles/loginStyle.ts
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backArrowIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  topContainer: {
    paddingHorizontal: 24,
    marginTop: 80,
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
    color: COLORS.transparentWhite,
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
  label: {
    fontSize: 14,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 16,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.textColor,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
