// src/screens/messages/Messages.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useMessages} from './useMessages';
import {messagesStyle as styles} from '../../styles/messagesStyle';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {ICONS} from '../../constants';

const Messages = () => {
  const {user, loading, chatItems} = useMessages();

  // Render each chat item in the list
  const renderChatItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.chatItem}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatMessage}>{item.message}</Text>
        </View>
        <Text style={styles.chatTime}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user has base64 photo, use it; otherwise, show default
  const avatarUri = user?.base64Photo || null;

  return (
    <View style={styles.container}>
      {/* Reusable gradient header */}
      <GradientHeader title="Messages" avatarUri={avatarUri} />

      {/* Chat List */}
      <View style={styles.listContainer}>
        <FlatList
          data={chatItems}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
    </View>
  );
};

export default Messages;
