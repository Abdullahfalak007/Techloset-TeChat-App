import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const inputBarStyles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  iconOutside: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOutsideImage: {
    width: 18,
    height: 18,
    tintColor: '#9FA5C0',
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 6,
  },
  sendIconWrapper: {
    width: 24,
    height: 24,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyTextSubtitle,
    resizeMode: 'contain',
  },
});
