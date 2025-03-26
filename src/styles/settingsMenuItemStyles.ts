import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const settingsMenuItemStyles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.bubbleOwnGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.gradientEnd,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.greyTextSubtitle,
    marginTop: 2,
  },
});
