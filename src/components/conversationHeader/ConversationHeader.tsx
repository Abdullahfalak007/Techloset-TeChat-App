import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {conversationHeaderStyles} from '../../styles/conversationHeaderStyle';
import {useConversationHeader} from '../../hooks/useConversationHeader';
import {ICONS} from '../../constants/icons';

type Props = {
  conversationId: string;
  onBackPress?: () => void;
};

const ConversationHeader: React.FC<Props> = ({conversationId, onBackPress}) => {
  // Use the custom hook to extract recipient info
  const {recipientName, avatarSource} = useConversationHeader(conversationId);

  return (
    <View style={conversationHeaderStyles.headerContainer}>
      {/* Back arrow triggers navigation */}
      <TouchableOpacity
        onPress={onBackPress}
        style={conversationHeaderStyles.iconWrapper}>
        <Image source={ICONS.backArrow} style={conversationHeaderStyles.icon} />
      </TouchableOpacity>
      {/* Display recipient avatar */}
      <Image source={avatarSource} style={conversationHeaderStyles.avatar} />
      {/* Display recipient name and status */}
      <View style={conversationHeaderStyles.textWrapper}>
        <Text style={conversationHeaderStyles.name}>{recipientName}</Text>
        <Text style={conversationHeaderStyles.status}>Active now</Text>
      </View>
    </View>
  );
};

export default ConversationHeader;
