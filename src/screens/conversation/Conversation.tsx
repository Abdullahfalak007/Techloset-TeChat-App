import React, {JSX} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ICONS} from '../../constants/icons';
import ConversationHeader from '../../components/conversationHeader/ConversationHeader';
import {useConversationLogic} from './useConversation';
import MessageItem from '../../components/messageItem/MessageItem';
import InputBar from '../../components/inputBar/InputBar';
import {conversationStyle as styles} from './conversationStyle';
import {useAppSelector} from '../../hooks/useStore';
import {
  ConversationRouteProp,
  Message,
  Conversation as ConversationType,
} from '../../constants/types';
import {COLORS} from '../../constants/colors';

const Conversation: React.FC = () => {
  const route = useRoute<ConversationRouteProp>();
  const navigation = useNavigation();
  const {conversationId} = route.params;
  const {user} = useAppSelector(state => state.auth);

  const {
    loading,
    inputText,
    setInputText,
    sectionListRef,
    sections,
    handleAttach,
    handleCamera,
    handleSend,
    formatTime,
    conversation,
    handleScroll,
    showScrollDown,
    scrollToBottom,
  } = useConversationLogic(conversationId);

  const renderMessage = ({
    item,
    index,
    section,
  }: {
    item: Message;
    index: number;
    section: {title: string; data: readonly Message[]};
  }): JSX.Element => {
    const isOwnMessage = item.senderId === user?.uid;
    let senderAvatar;
    let senderName = '';
    if (isOwnMessage) {
      senderAvatar = user?.photoURL ? {uri: user.photoURL} : ICONS.avatar;
      senderName = user?.displayName || 'You';
    } else {
      senderAvatar = (conversation as ConversationType)?.recipientPhoto
        ? {uri: (conversation as ConversationType).recipientPhoto!}
        : ICONS.avatar;
      senderName =
        (conversation as ConversationType)?.recipientName || 'Unknown';
    }
    return (
      <MessageItem
        item={item}
        index={index}
        section={section}
        isOwnMessage={isOwnMessage}
        senderAvatar={senderAvatar}
        senderName={senderName}
        formatTime={formatTime}
        timestamp={item.timestamp}
      />
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: {title: string; data: readonly Message[]};
  }): JSX.Element => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ConversationHeader
        conversationId={conversationId}
        onBackPress={() => navigation.goBack()}
      />

      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({item, index, section}) =>
          renderMessage({item, index, section})
        }
        renderSectionHeader={renderSectionHeader}
        style={styles.messageList}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() =>
          sectionListRef?.current
            ?.getScrollResponder()
            ?.scrollToEnd({animated: false})
        }
        onLayout={() =>
          sectionListRef?.current
            ?.getScrollResponder()
            ?.scrollToEnd({animated: false})
        }
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            sectionListRef?.current?.scrollToLocation({
              sectionIndex: 0,
              itemIndex: info.index,
              viewPosition: 0.5,
              animated: true,
            });
          }, 500);
        }}
      />

      <InputBar
        inputText={inputText}
        setInputText={setInputText}
        handleSend={handleSend}
        handleAttach={handleAttach}
        handleCamera={handleCamera}
      />

      {showScrollDown && (
        <TouchableOpacity
          style={styles.scrollDownButton}
          onPress={scrollToBottom}>
          <Image source={ICONS.arrowDown} style={styles.arrowDownIcon} />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default Conversation;
