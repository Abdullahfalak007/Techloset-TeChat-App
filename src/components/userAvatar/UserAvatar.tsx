import React from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';

type Props = {
  source: string | number;
  style?: StyleProp<ImageStyle>;
};

const UserAvatar: React.FC<Props> = ({source, style}) => {
  // If source is a string, assume it's a remote URL; otherwise, it's a local asset.
  if (typeof source === 'string') {
    return <Image source={{uri: source}} style={style} />;
  }
  return <Image source={source} style={style} />;
};

export default UserAvatar;
