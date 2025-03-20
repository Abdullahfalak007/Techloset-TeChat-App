// src/screens/conversationHeader/ConversationHeader.tsx
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useAppSelector} from '../../hooks/useStore';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';

type Props = {
  conversationId: string;
  currentUserId: string;
  onBackPress?: () => void;
};

const ConversationHeader: React.FC<Props> = ({
  conversationId,
  currentUserId,
  onBackPress,
}) => {
  // Get the conversation from our store.
  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  const recipientName = conversation?.recipientName || 'Unknown';
  const recipientPhoto = conversation?.recipientPhoto || null;

  const avatarSource = recipientPhoto ? {uri: recipientPhoto} : ICONS.avatar;

  return (
    <View style={styles.headerContainer}>
      {/* Back arrow */}
      <TouchableOpacity onPress={onBackPress} style={styles.iconWrapper}>
        <Image source={ICONS.backArrow} style={styles.icon} />
      </TouchableOpacity>

      {/* Recipient avatar */}
      <Image source={avatarSource} style={styles.avatar} />

      {/* Recipient name and status */}
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{recipientName}</Text>
        <Text style={styles.status}>Active now</Text>
      </View>
    </View>
  );
};

export default ConversationHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.black,
    resizeMode: 'contain',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  textWrapper: {
    marginLeft: 8,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  status: {
    fontSize: 12,
    color: COLORS.greyText,
  },
});
