import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const messageItemStyles = StyleSheet.create({
  messageWrapper: {
    marginBottom: 8,
  },
  messageRow: {
    flexDirection: 'column',
  },
  rowLeft: {
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  rowRight: {
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  headerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  headerRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  senderHeaderAvatarLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  senderHeaderAvatarRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  bubbleContainer: {
    maxWidth: '70%',
    padding: 8,
  },
  bubbleLeftCustom: {
    backgroundColor: COLORS.bubbleOwnGrey,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bubbleRightCustom: {
    backgroundColor: COLORS.gradientEnd,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bubbleOwn: {
    backgroundColor: COLORS.gradientStart,
  },
  bubbleText: {
    color: COLORS.black,
    fontSize: 14,
  },
  bubbleTextOwn: {
    color: COLORS.white,
  },
  timestampOutside: {
    fontSize: 10,
    color: COLORS.black,
    marginTop: 4,
    textAlign: 'right',
  },
  timestampLeft: {
    alignSelf: 'flex-end',
  },
  timestampRight: {
    alignSelf: 'flex-end',
  },
  imageBubble: {
    overflow: 'hidden',
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});
