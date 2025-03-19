// src/components/gradientHeader/GradientHeader.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';

type GradientHeaderProps = {
  title: string;
  isContactsScreen?: boolean;
  onSearchPress?: () => void;
  onAddPress?: () => void;
  avatarUri?: string | null;
  searchActive?: boolean;
  searchValue?: string;
  onChangeSearch?: (text: string) => void;
};

const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  isContactsScreen = false,
  onSearchPress,
  onAddPress,
  avatarUri,
  searchActive = false,
  searchValue,
  onChangeSearch,
}) => {
  const avatarSource = avatarUri ? {uri: avatarUri} : ICONS.avatar;

  if (searchActive) {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInputHeader}
            value={searchValue}
            onChangeText={onChangeSearch}
            placeholder={
              isContactsScreen ? 'Search contacts...' : 'Search messages...'
            }
            placeholderTextColor="rgba(255,255,255,0.7)"
            autoFocus
          />
          <TouchableOpacity
            style={styles.searchIconWrapper}
            onPress={onSearchPress}>
            <Image source={ICONS.search} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (isContactsScreen) {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}>
            <Image source={ICONS.search} style={styles.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {flex: 1, textAlign: 'center'}]}>
            {title}
          </Text>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onAddPress}
            activeOpacity={0.7}>
            <Image source={ICONS.addContact} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}>
            <Image source={ICONS.search} style={styles.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {flex: 1, textAlign: 'center'}]}>
            {title}
          </Text>
          <View style={styles.iconContainer}>
            <Image source={avatarSource} style={styles.headerAvatar} />
          </View>
        </View>
      </LinearGradient>
    );
  }
};

export default GradientHeader;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerRow: {
    flexDirection: 'row',
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
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.transparentWhite,
    borderRadius: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparentWhite,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  searchInputHeader: {
    flex: 1,
    height: 40,
    color: COLORS.white,
    fontSize: 16,
  },
  searchIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
});
