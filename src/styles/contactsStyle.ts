import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const contactsStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Updated container for the list
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20, // Overlap the gradient header.
    padding: 16,
  },
  myContactLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: COLORS.black,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textColor,
    marginTop: 2,
  },
  addButtonContainer: {
    backgroundColor: COLORS.transparentWhite,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});
