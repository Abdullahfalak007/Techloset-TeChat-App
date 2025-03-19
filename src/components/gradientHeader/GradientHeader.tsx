// // src/components/gradientHeader/GradientHeader.tsx
// import React from 'react';
// import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {COLORS} from '../../constants/colors';
// import {ICONS} from '../../constants';

// type GradientHeaderProps = {
//   title: string;
//   /**
//    * If true, we show the Contacts layout: search icon on the left,
//    * title in the middle, add-contact icon on the right.
//    * Otherwise, we show the default ChatList layout (title on the left, avatar on the right).
//    */
//   isContactsScreen?: boolean;
//   onSearchPress?: () => void;
//   onAddPress?: () => void;
//   avatarUri?: string | null;
// };

// const GradientHeader: React.FC<GradientHeaderProps> = ({
//   title,
//   isContactsScreen = false,
//   onSearchPress,
//   onAddPress,
//   avatarUri,
// }) => {
//   // For the old layout (e.g. ChatList), if no avatarUri is given, fallback to default avatar
//   const avatarSource = avatarUri ? {uri: avatarUri} : ICONS.avatar;

//   if (isContactsScreen) {
//     // ========== CONTACTS SCREEN LAYOUT ==========
//     return (
//       <LinearGradient
//         colors={[COLORS.gradientStart, COLORS.gradientEnd]}
//         style={styles.headerContainer}>
//         <View style={styles.headerRow}>
//           {/* Search icon on the left */}
//           <TouchableOpacity
//             style={styles.iconContainer}
//             onPress={onSearchPress}
//             activeOpacity={0.7}>
//             <Image source={ICONS.search} style={styles.icon} />
//           </TouchableOpacity>

//           {/* Title in the middle */}
//           <Text style={[styles.headerTitle, {textAlign: 'center', flex: 1}]}>
//             {title}
//           </Text>

//           {/* Add-contact icon on the right */}
//           <TouchableOpacity
//             style={styles.iconContainer}
//             onPress={onAddPress}
//             activeOpacity={0.7}>
//             <Image source={ICONS.addContact} style={styles.icon} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//     );
//   } else {
//     // ========== DEFAULT LAYOUT (e.g. CHAT LIST) ==========
//     return (
//       <LinearGradient
//         colors={[COLORS.gradientStart, COLORS.gradientEnd]}
//         style={styles.headerContainer}>
//         <View style={styles.headerRow}>
//           {/* Title on the left */}
//           <Text style={styles.headerTitle}>{title}</Text>
//           {/* User avatar on the right */}
//           <Image source={avatarSource} style={styles.headerAvatar} />
//         </View>
//       </LinearGradient>
//     );
//   }
// };

// export default GradientHeader;

// const styles = StyleSheet.create({
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     color: COLORS.white,
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   headerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginLeft: 'auto', // push avatar to the right
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     tintColor: COLORS.white, // if you want it tinted white
//     resizeMode: 'contain',
//   },
// });

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
  /**
   * If true, we show the Contacts layout.
   * When in search mode, the header will show a search bar in place of the search icon and title.
   */
  isContactsScreen?: boolean;
  onSearchPress?: () => void;
  onAddPress?: () => void;
  avatarUri?: string | null;
  // New props for search mode:
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
  // For the default (ChatList) layout, if no avatarUri is given, fallback to default avatar
  const avatarSource = avatarUri ? {uri: avatarUri} : ICONS.avatar;

  if (isContactsScreen) {
    if (searchActive) {
      // Show search bar in place of the search icon and title.
      return (
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.headerContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInputHeader}
              value={searchValue}
              onChangeText={onChangeSearch}
              placeholder="Search contacts..."
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
    // Default Contacts header layout: search icon, title, add-contact icon.
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerContainer}>
        <View style={styles.headerRow}>
          {/* Search icon on the left */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}>
            <Image source={ICONS.search} style={styles.icon} />
          </TouchableOpacity>

          {/* Title in the middle */}
          <Text style={[styles.headerTitle, {flex: 1, textAlign: 'center'}]}>
            {title}
          </Text>

          {/* Add-contact icon on the right */}
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
    // Default layout for non-Contacts screens (e.g. ChatList)
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Image source={avatarSource} style={styles.headerAvatar} />
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
    marginLeft: 'auto',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
  // New styles for search bar in header
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInputHeader: {
    flex: 1,
    height: 40,
    color: COLORS.white,
    fontSize: 16,
  },
  searchIconWrapper: {
    padding: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.white,
    resizeMode: 'contain',
  },
});
