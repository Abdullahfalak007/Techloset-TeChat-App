import React from 'react';
import {Image} from 'react-native';
import {UserAvatarProps} from '../../constants/types';

const UserAvatar: React.FC<UserAvatarProps> = ({source, style}) => {
  if (typeof source === 'string') {
    return <Image source={{uri: source}} style={style} />;
  }
  return <Image source={source} style={style} />;
};

export default UserAvatar;
