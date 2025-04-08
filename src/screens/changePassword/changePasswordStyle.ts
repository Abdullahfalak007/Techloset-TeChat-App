import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const changePasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    marginTop: -28,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-around',
  },
  formContainer: {
    marginBottom: 40,
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
    minHeight: 40,
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
