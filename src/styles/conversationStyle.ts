import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const conversationStyles = StyleSheet.create({
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
  // Wrapper for each message block
  messageWrapper: {
    marginBottom: 8,
  },
  // Row for message block (bubble + timestamp)
  messageRow: {
    flexDirection: 'column',
  },
  // Alignment for left vs. right messages
  rowLeft: {
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  rowRight: {
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  // Header row for avatar and sender name
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
  // Bubble container for message content
  bubbleContainer: {
    maxWidth: '70%',
    padding: 8,
  },
  // Bubble style for left aligned messages: all borders round except the top left
  bubbleLeftCustom: {
    backgroundColor: COLORS.bubbleOwnGrey,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  // Bubble style for right aligned messages: all borders round except the top right
  bubbleRightCustom: {
    backgroundColor: COLORS.gradientEnd,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  // For own messages override (if needed)
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
  // Timestamp rendered outside the bubble (below)
  timestampOutside: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  // For timestamp alignment
  timestampLeft: {
    alignSelf: 'flex-end',
  },
  timestampRight: {
    alignSelf: 'flex-end',
  },
  // Image bubble styles
  imageBubble: {
    overflow: 'hidden',
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  // Input bar styles
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 4,
  },
  iconOutside: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOutsideImage: {
    width: 18,
    height: 18,
    tintColor: '#9FA5C0',
    resizeMode: 'contain',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F7F9FB',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 6,
  },
  sendIconWrapper: {
    width: 24,
    height: 24,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: '#9FA5C0',
    resizeMode: 'contain',
  },
  // Section header for grouping messages by day
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
});
