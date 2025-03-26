import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

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
    fontWeight: '400',
    fontSize: 68,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyText,
    marginBottom: 32,
  },

  /* Google Button (Icon Only) */
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
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.transparentWhite,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },

  /* Divider Container */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.signupButtonBackground,
  },
  orText: {
    marginHorizontal: 8,
    color: COLORS.white,
  },

  /* Sign Up Button */
  signUpButton: {
    backgroundColor: COLORS.signupButtonBackground,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Existing Account? Log in */
  existingAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  existingAccountText: {
    color: COLORS.white,
  },
  loginText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
