import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import UserAvatar from '../userAvatar/UserAvatar';
import {ICONS} from '../../constants/icons';
import {contactsStyles} from '../../styles/contactsStyle';
import Loader from '../loader/Loader';
import {ContactItemProps} from '../../constants/types';

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  showAddButton,
  isAdding,
  onAddPress,
}) => {
  // Determine the avatar source based on base64Photo, photoURL, or fallback icon.
  const avatarSource =
    contact.base64Photo &&
    typeof contact.base64Photo === 'string' &&
    contact.base64Photo.trim() !== ''
      ? {uri: contact.base64Photo}
      : contact.photoURL &&
        typeof contact.photoURL === 'string' &&
        contact.photoURL.trim() !== ''
      ? {uri: contact.photoURL}
      : ICONS.avatar;

  return (
    <View style={contactsStyles.contactRow}>
      <View style={contactsStyles.leftContainer}>
        <UserAvatar source={avatarSource} style={contactsStyles.avatar} />
        <View style={contactsStyles.textContainer}>
          <Text style={contactsStyles.name}>
            {contact.displayName || contact.email}
          </Text>
          <Text style={contactsStyles.subtitle}>{contact.status}</Text>
        </View>
      </View>
      {showAddButton && (
        <TouchableOpacity
          onPress={() => onAddPress(contact.uid)}
          style={contactsStyles.addButtonContainer}>
          {isAdding ? (
            <Loader />
          ) : (
            <Image source={ICONS.addContact} style={contactsStyles.addIcon} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ContactItem;
