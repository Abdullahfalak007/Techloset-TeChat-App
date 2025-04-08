import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const chatListStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -28,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.black,
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    flexShrink: 1,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.black,
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textColor,
    flexShrink: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.redBackground,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.redBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    alignSelf: 'center',
  },
  deleteIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.black,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.greyTextSubtitle,
    fontSize: 16,
    textAlign: 'center',
  },
});
