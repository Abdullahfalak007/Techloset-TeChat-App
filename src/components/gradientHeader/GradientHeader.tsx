// src/components/gradientHeader/GradientHeader.tsx

import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';

type GradientHeaderProps = {
  title: string;
  avatarUri?: string | null; // base64 or external URL
};

const GradientHeader: React.FC<GradientHeaderProps> = ({title, avatarUri}) => {
  // If there's no avatarUri, fall back to the default avatar
  const avatarSource = avatarUri ? {uri: avatarUri} : ICONS.avatar;

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Image source={avatarSource} style={styles.headerAvatar} />
      </View>
    </LinearGradient>
  );
};

export default GradientHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
