import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const conversationStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionHeaderContainer: {
    alignSelf: 'center',
    marginVertical: 8,
    backgroundColor: COLORS.bubbleOwnGrey,
    padding: 4,
    borderRadius: 8,
  },
  sectionHeaderText: {
    color: '#999',
    fontSize: 12,
  },
  scrollDownButton: {
    position: 'absolute',
    bottom: 80, // adjust based on your input bar height
    right: 200,
    backgroundColor: COLORS.lightGrey,
    padding: 8,
    borderRadius: 20,
  },
  arrowDownIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
});
