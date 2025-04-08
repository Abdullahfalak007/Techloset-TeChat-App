import React from 'react';
import {View, Text, Image} from 'react-native';
import {messageItemStyles as styles} from './messageItemStyle';
import {MessageItemProps} from '../../constants/types';

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  index,
  section,
  isOwnMessage,
  senderAvatar,
  senderName,
  formatTime,
}) => {
  const showHeader =
    index === 0 || section.data[index - 1].senderId !== item.senderId;

  return (
    <View style={styles.messageWrapper}>
      {showHeader && (
        <View
          style={isOwnMessage ? styles.headerRowRight : styles.headerRowLeft}>
          {isOwnMessage ? (
            <>
              <Text style={styles.senderName}>{senderName}</Text>
              <Image
                source={senderAvatar}
                style={styles.senderHeaderAvatarRight}
              />
            </>
          ) : (
            <>
              <Image
                source={senderAvatar}
                style={styles.senderHeaderAvatarLeft}
              />
              <Text style={styles.senderName}>{senderName}</Text>
            </>
          )}
        </View>
      )}
      {item.type === 'image' ? (
        <View
          style={[
            styles.messageRow,
            isOwnMessage ? styles.rowRight : styles.rowLeft,
          ]}>
          <View
            style={[
              styles.bubbleContainer,
              isOwnMessage ? styles.bubbleRightCustom : styles.bubbleLeftCustom,
              styles.imageBubble,
              isOwnMessage && styles.bubbleOwn,
            ]}>
            <Image
              source={{uri: `data:image/jpeg;base64,${item.text}`}}
              style={styles.imageContent}
              resizeMode="cover"
            />
          </View>
          <Text
            style={[
              styles.timestampOutside,
              isOwnMessage ? styles.timestampRight : styles.timestampLeft,
            ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.messageRow,
            isOwnMessage ? styles.rowRight : styles.rowLeft,
          ]}>
          <View
            style={[
              styles.bubbleContainer,
              isOwnMessage ? styles.bubbleRightCustom : styles.bubbleLeftCustom,
              isOwnMessage && styles.bubbleOwn,
            ]}>
            <Text
              style={[styles.bubbleText, isOwnMessage && styles.bubbleTextOwn]}>
              {item.text}
            </Text>
          </View>
          <Text
            style={[
              styles.timestampOutside,
              isOwnMessage ? styles.timestampRight : styles.timestampLeft,
            ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default MessageItem;
