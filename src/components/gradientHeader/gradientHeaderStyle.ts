import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const gradientHeaderStyle = StyleSheet.create({
  headerContainer: {
    height: 150,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.transparentWhite,
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    resizeMode: 'contain',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparentWhite,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  searchInputHeader: {
    flex: 1,
    height: 40,
    color: COLORS.white,
    fontSize: 16,
  },
  searchIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 14,
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
    zIndex: 20,
  },
  dropdownHeader: {
    alignItems: 'flex-end',
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dropdownAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    alignSelf: 'center',
    padding: 8,
  },
});
