import {useAppSelector} from '../hooks/useStore';
import {ICONS} from '../constants';

export const useConversationHeader = (conversationId: string) => {
  const conversation = useAppSelector(state =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  const recipientName = conversation?.recipientName || 'Unknown';
  const recipientPhoto = conversation?.recipientPhoto || null;
  const avatarSource = recipientPhoto ? {uri: recipientPhoto} : ICONS.avatar;

  return {recipientName, avatarSource};
};
