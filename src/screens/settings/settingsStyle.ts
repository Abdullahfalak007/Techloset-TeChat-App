import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -28,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginTop: -15,
    marginBottom: 20,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    borderBottomColor: COLORS.greyTextSubtitle,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  userStatus: {
    fontSize: 12,
    color: COLORS.greyTextSubtitle,
    fontWeight: '400',
    marginTop: 4,
  },
});
