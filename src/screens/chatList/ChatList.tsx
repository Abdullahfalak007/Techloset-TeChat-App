import React from 'react';
import {
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useChatList, ConversationDoc, timeAgo} from './useChatList';
import {chatListStyles} from '../../styles/chatlistStyle';
import {COLORS} from '../../constants/colors';
import ConversationItem from '../../components/conversationItem/ConversationItem';

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
          <FlatList
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatList;
