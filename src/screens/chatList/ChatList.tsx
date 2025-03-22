import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useChatList, ConversationDoc, timeAgo} from './useChatList';
import {chatListStyles} from '../../styles/chatlistStyle';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/colors';

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
    navigation,
    timeAgo,
  } = useChatList();

  const renderRightActions = (conversationId: string) => (
    <TouchableOpacity
      style={chatListStyles.deleteIconContainer}
      onPress={() => handleDeleteConversation(conversationId)}>
      <Image
        source={ICONS.delete}
        style={chatListStyles.deleteIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  const renderItem = ({item}: {item: ConversationDoc}) => {
    const unreadCount = item.unreadCounts?.[user?.uid || ''] || 0;
    const lastMessageTime = timeAgo(item.updatedAt);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity
          style={chatListStyles.itemContainer}
          onPress={() => handleOpenConversation(item.id)}>
          {item.recipientPhoto ? (
            <Image
              source={{uri: item.recipientPhoto}}
              style={chatListStyles.profileImage}
            />
          ) : (
            <Image source={ICONS.avatar} style={chatListStyles.profileImage} />
          )}
          <View style={chatListStyles.textWrapper}>
            <View style={chatListStyles.topRow}>
              <Text style={chatListStyles.convTitle}>{item.recipientName}</Text>
              <Text style={chatListStyles.timeText}>{lastMessageTime}</Text>
            </View>
            <View style={chatListStyles.bottomRow}>
              <Text style={chatListStyles.lastMessage}>
                {item.lastMessage || 'No messages yet'}
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
          avatarUri={user?.photoURL ?? ICONS.avatar}
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
