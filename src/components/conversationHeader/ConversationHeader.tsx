import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {conversationHeaderStyles} from './conversationHeaderStyle';
import {useConversationHeader} from '../../hooks/useConversationHeader';
import {ICONS} from '../../constants/icons';
import UserAvatar from '../userAvatar/UserAvatar';
import {ConversationHeaderProps} from '../../constants/types';

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversationId,
  onBackPress,
}) => {
  const {recipientName, avatarSource} = useConversationHeader(conversationId);

  return (
    <View style={conversationHeaderStyles.headerContainer}>
      <TouchableOpacity
        onPress={onBackPress}
        style={conversationHeaderStyles.iconWrapper}>
        <Image source={ICONS.backArrow} style={conversationHeaderStyles.icon} />
      </TouchableOpacity>

      <UserAvatar
        source={avatarSource}
        style={conversationHeaderStyles.avatar}
      />

      <View style={conversationHeaderStyles.textWrapper}>
        <Text style={conversationHeaderStyles.name}>{recipientName}</Text>
        <Text style={conversationHeaderStyles.status}>Active now</Text>
      </View>
    </View>
  );
};

export default ConversationHeader;
