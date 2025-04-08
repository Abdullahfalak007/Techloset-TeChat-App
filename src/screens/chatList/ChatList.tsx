import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Text,
} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useChatList, timeAgo} from './useChatList';
import {chatListStyles} from './chatlistStyle';
import {COLORS} from '../../constants/colors';
import ConversationItem from '../../components/conversationItem/ConversationItem';
import {ConversationDoc} from '../../constants/types';

const ChatList: React.FC = () => {
  const {
    user,
    loading,
    conversations,
    searchActive,
    searchTerm,
    setSearchTerm,
    handleSearchPress,
    handleOpenConversation,
    handleDeleteConversation,
    deletingConversations,
  } = useChatList();

  const renderItem = ({item}: {item: ConversationDoc}) => {
    const isDeleting = deletingConversations.has(item.id);
    return (
      <ConversationItem
        conversation={item}
        userId={user?.uid || ''}
        onPress={() => handleOpenConversation(item.id)}
        onDelete={() => handleDeleteConversation(item.id)}
        timeAgo={timeAgo}
        isDeleting={isDeleting}
      />
    );
  };

  if (loading) {
    return (
      <View style={chatListStyles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (searchActive) {
          setSearchTerm('');
          Keyboard.dismiss();
        }
      }}>
      <View style={{flex: 1}}>
        <GradientHeader
          title="Home"
          avatarUri={user?.photoURL}
          isContactsScreen={false}
          searchActive={searchActive}
          searchValue={searchTerm}
          onChangeSearch={setSearchTerm}
          onSearchPress={handleSearchPress}
        />
        <View style={chatListStyles.roundedContainer}>
          {conversations.length > 0 ? (
            <FlatList
              data={conversations}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          ) : (
            <View style={chatListStyles.emptyContainer}>
              <Text style={chatListStyles.emptyText}>
                No Conversations Yet!
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatList;
