import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const forgotPasswordStyle = StyleSheet.create({
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
  middleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 16,
  },
  bottomContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 20,
  },
  gradientButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
