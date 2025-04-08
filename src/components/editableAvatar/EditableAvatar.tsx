import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import UserAvatar from '../userAvatar/UserAvatar';
import {ICONS} from '../../constants/icons';
import {editableAvatarStyles as styles} from './editableAvatarStyle';
import {EditableAvatarProps} from '../../constants/types';

const EditableAvatar: React.FC<EditableAvatarProps> = ({
  avatarSource,
  onEdit,
}) => {
  return (
    <View style={styles.container}>
      <UserAvatar source={avatarSource} style={styles.avatar} />
      <TouchableOpacity style={styles.editIconWrapper} onPress={onEdit}>
        <UserAvatar source={ICONS.edit} style={styles.editIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default EditableAvatar;
