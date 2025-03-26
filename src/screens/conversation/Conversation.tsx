import React from 'react';
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
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../constants/types';
import {ICONS} from '../../constants/icons';
import ConversationHeader from '../../components/conversationHeader/ConversationHeader';
import {useConversationLogic} from './useConversation';
import MessageItem from '../../components/messageItem/MessageItem';
import InputBar from '../../components/inputBar/InputBar';
import {conversationStyle as styles} from '../../styles/conversationStyle';
import {useAppSelector} from '../../hooks/useStore';

type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

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

  // Render a single message using the MessageItem component.
  const renderMessage = ({
    item,
    index,
    section,
  }: {
    item: any;
    index: number;
    section: {title: string; data: readonly any[]};
  }) => {
    const isOwnMessage = item.senderId === user?.uid;
    let senderAvatar = ICONS.avatar;
    let senderName = '';
    if (isOwnMessage) {
      senderAvatar = user?.photoURL ? {uri: user.photoURL} : ICONS.avatar;
      senderName = user?.displayName || 'You';
    } else {
      senderAvatar = conversation?.recipientPhoto
        ? {uri: conversation.recipientPhoto}
        : ICONS.avatar;
      senderName = conversation?.recipientName || 'Unknown';
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
      />
    );
  };

  // Render section header for grouping messages by day.
  const renderSectionHeader = ({
    section,
  }: {
    section: {title: string; data: readonly any[]};
  }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
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
        onScrollToIndexFailed={info => {
          console.warn('Scroll to index failed: ', info);
          // Retry scrolling after a delay.
          setTimeout(() => {
            sectionListRef.current?.scrollToLocation({
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
