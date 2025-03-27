import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const conversationHeaderStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.black,
    resizeMode: 'contain',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  textWrapper: {
    marginLeft: 8,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  status: {
    fontSize: 12,
    color: COLORS.black,
  },
});
