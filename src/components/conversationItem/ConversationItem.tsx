import React from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import Loader from '../loader/Loader';
import {ICONS} from '../../constants/icons';
import {chatListStyles} from '../../screens/chatList/chatlistStyle';
import {ConversationItemProps} from '../../constants/types';

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  userId,
  onPress,
  onDelete,
  timeAgo,
  isDeleting,
}) => {
  const unreadCount = conversation.unreadCounts?.[userId] || 0;
  const lastMessageTime = timeAgo(conversation.updatedAt);

  const renderRightActions = () => {
    if (isDeleting) {
      return <Loader style={{marginRight: 10}} />;
    }
    return (
      <TouchableOpacity
        style={chatListStyles.deleteIconContainer}
        onPress={onDelete}>
        <Image
          source={ICONS.delete}
          style={chatListStyles.deleteIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={chatListStyles.itemContainer} onPress={onPress}>
        {conversation.recipientPhoto ? (
          <Image
            source={{uri: conversation.recipientPhoto}}
            style={chatListStyles.profileImage}
          />
        ) : (
          <Image source={ICONS.avatar} style={chatListStyles.profileImage} />
        )}
        <View style={chatListStyles.textWrapper}>
          <View style={chatListStyles.topRow}>
            <Text style={chatListStyles.convTitle}>
              {conversation.recipientName}
            </Text>
            <Text style={chatListStyles.timeText}>{lastMessageTime}</Text>
          </View>
          <View style={chatListStyles.bottomRow}>
            <Text style={chatListStyles.lastMessage}>
              {conversation.lastMessage || 'No messages yet'}
            </Text>
            {unreadCount > 0 && (
              <View style={chatListStyles.unreadBadge}>
                <Text style={chatListStyles.unreadBadgeText}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ConversationItem;
