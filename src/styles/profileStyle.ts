import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerContainer: {
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  avatarContainer: {
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
  infoGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.tabBarActiveTintColor,
    fontWeight: '500',
    marginBottom: 4,
  },
  valueInput: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '400',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyTextSubtitle,
    paddingBottom: 8,
  },
  updateButton: {
    marginTop: 40,
    width: '100%',
    backgroundColor: COLORS.tabBarActiveTintColor,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
