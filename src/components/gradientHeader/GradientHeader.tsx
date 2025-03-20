// src/components/gradientHeader/GradientHeader.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {signOut} from '../../store/slices/authSlice';

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
  const avatarSource = avatarUri ? {uri: avatarUri} : ICONS.avatar;

  const handleLogout = () => {
    dispatch(signOut());
    setDropdownVisible(false);
  };

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
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setDropdownVisible(prev => !prev)}>
            {avatarUri ? (
              <Image source={avatarSource} style={styles.headerAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </TouchableOpacity>

          {dropdownVisible && (
            <Modal
              transparent
              animationType="none"
              visible={dropdownVisible}
              onRequestClose={() => setDropdownVisible(false)}>
              <TouchableWithoutFeedback
                onPress={() => setDropdownVisible(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.dropdown}>
                      <View style={styles.dropdownHeader}>
                        <TouchableOpacity
                          onPress={() => setDropdownVisible(false)}>
                          <Image source={ICONS.close} style={styles.icon} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.profileInfo}>
                        {avatarUri ? (
                          <Image
                            source={{uri: avatarUri}}
                            style={styles.dropdownAvatar}
                          />
                        ) : (
                          <View style={styles.dropdownAvatarPlaceholder} />
                        )}
                        <Text style={styles.userName}>
                          {user?.displayName || 'User Name'}
                        </Text>
                        <Text style={styles.userEmail}>
                          {user?.email || 'user@example.com'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}>
                        <Image source={ICONS.logout} style={styles.icon} />
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
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
    tintColor: COLORS.black,
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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  dropdown: {
    position: 'absolute',
    top: 50, // adjust this value to position the dropdown correctly
    right: 14,
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
    zIndex: 20,
  },
  dropdownHeader: {
    alignItems: 'flex-end',
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dropdownAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  dropdownAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  userName: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutButton: {
    alignSelf: 'center',
    padding: 8,
  },
});
