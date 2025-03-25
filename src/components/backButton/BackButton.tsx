import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';

interface BackButtonProps {
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress ? onPress : () => navigation.goBack()}>
      <Image source={ICONS.backArrow} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
});

export default BackButton;
