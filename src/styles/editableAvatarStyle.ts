import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const editableAvatarStyles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 3,
    right: 10,
    backgroundColor: COLORS.tabBarActiveTintColor,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 16,
    height: 16,
  },
});
