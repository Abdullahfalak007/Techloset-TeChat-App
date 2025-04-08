import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ICONS} from '../../constants/icons';
import {backButtonStyle} from './backButtonStyle';
import {BackButtonProps} from '../../constants/types';

const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={backButtonStyle.container}
      onPress={onPress ? onPress : () => navigation.goBack()}>
      <Image source={ICONS.backArrow} style={backButtonStyle.icon} />
    </TouchableOpacity>
  );
};

export default BackButton;
