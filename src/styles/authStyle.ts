// src/styles/authStyle.ts
import {StyleSheet} from 'react-native';
import {colors} from '../constants/colors';

export const authStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 68,
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  dividerText: {
    textAlign: 'center',
    color: colors.white,
    marginVertical: 8,
  },
  signUpButton: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  existingAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  existingAccountText: {
    color: colors.white,
  },
  loginText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
