import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  SectionList,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../constants/types';
import {ICONS} from '../../constants/icons';
import ConversationHeader from '../../components/conversationHeader/ConversationHeader';
import {useConversationLogic} from './useConversation';
import {conversationStyles as styles} from '../../styles/conversationStyle';
import {useAppSelector} from '../../hooks/useStore';

type ConversationRouteProp = RouteProp<MainStackParamList, 'Conversation'>;

const Conversation = () => {
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

  // Render a single message (existing logic)
  const renderMessage = ({
    item,
    index,
    section,
  }: {
    item: any;
    index: number;
    section: {title: string; data: ReadonlyArray<any>};
  }) => {
    const showHeader =
      index === 0 || section.data[index - 1].senderId !== item.senderId;
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
      <View style={styles.messageWrapper}>
        {showHeader && (
          <View
            style={isOwnMessage ? styles.headerRowRight : styles.headerRowLeft}>
            {isOwnMessage ? (
              <>
                <Text style={styles.senderName}>{senderName}</Text>
                <Image
                  source={senderAvatar}
                  style={styles.senderHeaderAvatarRight}
                />
              </>
            ) : (
              <>
                <Image
                  source={senderAvatar}
                  style={styles.senderHeaderAvatarLeft}
                />
                <Text style={styles.senderName}>{senderName}</Text>
              </>
            )}
          </View>
        )}
        {item.type === 'image' ? (
          <View
            style={[
              styles.messageRow,
              isOwnMessage ? styles.rowRight : styles.rowLeft,
            ]}>
            <View
              style={[
                styles.bubbleContainer,
                isOwnMessage
                  ? styles.bubbleRightCustom
                  : styles.bubbleLeftCustom,
                styles.imageBubble,
                isOwnMessage && styles.bubbleOwn,
              ]}>
              <Image
                source={{uri: `data:image/jpeg;base64,${item.text}`}}
                style={styles.imageContent}
                resizeMode="cover"
              />
            </View>
            <Text
              style={[
                styles.timestampOutside,
                isOwnMessage ? styles.timestampRight : styles.timestampLeft,
              ]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.messageRow,
              isOwnMessage ? styles.rowRight : styles.rowLeft,
            ]}>
            <View
              style={[
                styles.bubbleContainer,
                isOwnMessage
                  ? styles.bubbleRightCustom
                  : styles.bubbleLeftCustom,
                isOwnMessage && styles.bubbleOwn,
              ]}>
              <Text
                style={[
                  styles.bubbleText,
                  isOwnMessage && styles.bubbleTextOwn,
                ]}>
                {item.text}
              </Text>
            </View>
            <Text
              style={[
                styles.timestampOutside,
                isOwnMessage ? styles.timestampRight : styles.timestampLeft,
              ]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render section header for grouping messages by day
  const renderSectionHeader = ({
    section,
  }: {
    section: {title: string; data: ReadonlyArray<any>};
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
              sectionIndex: 0, // Adjust this if scrolling within a specific section
              itemIndex: info.index,
              viewPosition: 0.5, // try to center the item
              animated: true,
            });
          }, 500);
        }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.iconOutside} onPress={handleAttach}>
          <Image source={ICONS.paperclip} style={styles.iconOutsideImage} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write your message"
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendIconWrapper} onPress={handleSend}>
            <Image source={ICONS.send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconOutside} onPress={handleCamera}>
          <Image source={ICONS.camera} style={styles.iconOutsideImage} />
        </TouchableOpacity>
      </View>

      {/* Floating Arrow Down Button */}
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
