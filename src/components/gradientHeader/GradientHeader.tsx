import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';
import {useAppDispatch, useAppSelector} from '../../hooks/useStore';
import {signOut} from '../../store/slices/authSlice';
import UserAvatar from '../userAvatar/UserAvatar';
import {gradientHeaderStyle} from '../../styles/gradientHeaderStyle';
import {GradientHeaderProps} from '../../constants/types';

const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  isContactsScreen = false,
  onSearchPress,
  onAddPress,
  avatarUri,
  searchActive = false,
  searchValue,
  onChangeSearch,
  isScreenWithBackArrow = false,
  onBackPress,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);

  const defaultAvatar = ICONS.avatar;
  const finalAvatarUri = avatarUri ?? user?.photoURL ?? defaultAvatar;

  // Render the avatar using the UserAvatar component
  const renderAvatar = () => {
    return (
      <UserAvatar
        source={finalAvatarUri}
        style={gradientHeaderStyle.headerAvatar}
      />
    );
  };

  const handleLogout = () => {
    dispatch(signOut());
    setDropdownVisible(false);
  };

  if (isScreenWithBackArrow) {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={gradientHeaderStyle.headerContainer}>
        <View style={gradientHeaderStyle.headerRow}>
          <TouchableOpacity
            style={gradientHeaderStyle.iconContainer}
            onPress={onBackPress}
            activeOpacity={0.7}>
            <Image source={ICONS.backArrow} style={gradientHeaderStyle.icon} />
          </TouchableOpacity>
          <Text
            style={[
              gradientHeaderStyle.headerTitle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {title}
          </Text>
          <View style={{width: 40}} />
        </View>
      </LinearGradient>
    );
  }

  if (searchActive) {
    return (
      <TouchableWithoutFeedback onPress={onSearchPress}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={gradientHeaderStyle.headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              /* stops propagation */
            }}>
            <View style={gradientHeaderStyle.searchBarContainer}>
              <TextInput
                style={gradientHeaderStyle.searchInputHeader}
                value={searchValue}
                onChangeText={onChangeSearch}
                placeholder={
                  isContactsScreen ? 'Search contacts...' : 'Search messages...'
                }
                placeholderTextColor="rgba(255,255,255,0.7)"
                autoFocus
                onBlur={() => {
                  if (searchActive && onSearchPress) {
                    onSearchPress();
                  }
                }}
              />
              <TouchableOpacity
                style={gradientHeaderStyle.searchIconWrapper}
                onPress={onSearchPress}>
                <Image
                  source={ICONS.search}
                  style={gradientHeaderStyle.searchIcon}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  if (isContactsScreen) {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={gradientHeaderStyle.headerContainer}>
        <View style={gradientHeaderStyle.headerRow}>
          <TouchableOpacity
            style={gradientHeaderStyle.iconContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}>
            <Image source={ICONS.search} style={gradientHeaderStyle.icon} />
          </TouchableOpacity>
          <Text
            style={[
              gradientHeaderStyle.headerTitle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {title}
          </Text>
          <TouchableOpacity
            style={gradientHeaderStyle.iconContainer}
            onPress={onAddPress}
            activeOpacity={0.7}>
            <Image source={ICONS.addContact} style={gradientHeaderStyle.icon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  } else {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={gradientHeaderStyle.headerContainer}>
        <View style={gradientHeaderStyle.headerRow}>
          <TouchableOpacity
            style={gradientHeaderStyle.iconContainer}
            onPress={onSearchPress}
            activeOpacity={0.7}>
            <Image source={ICONS.search} style={gradientHeaderStyle.icon} />
          </TouchableOpacity>
          <Text
            style={[
              gradientHeaderStyle.headerTitle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {title}
          </Text>
          <TouchableOpacity
            style={gradientHeaderStyle.iconContainer}
            onPress={() => setDropdownVisible(prev => !prev)}>
            {renderAvatar()}
          </TouchableOpacity>
          {dropdownVisible && (
            <Modal
              transparent
              animationType="none"
              visible={dropdownVisible}
              onRequestClose={() => setDropdownVisible(false)}>
              <TouchableWithoutFeedback
                onPress={() => setDropdownVisible(false)}>
                <View style={gradientHeaderStyle.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={gradientHeaderStyle.dropdown}>
                      <View style={gradientHeaderStyle.dropdownHeader}>
                        <TouchableOpacity
                          onPress={() => setDropdownVisible(false)}>
                          <Image
                            source={ICONS.close}
                            style={gradientHeaderStyle.icon}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={gradientHeaderStyle.profileInfo}>
                        <UserAvatar
                          source={finalAvatarUri}
                          style={gradientHeaderStyle.dropdownAvatar}
                        />
                        <Text style={gradientHeaderStyle.userName}>
                          {user?.displayName || 'User Name'}
                        </Text>
                        <Text style={gradientHeaderStyle.userEmail}>
                          {user?.email || 'user@example.com'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={gradientHeaderStyle.logoutButton}
                        onPress={handleLogout}>
                        <UserAvatar
                          source={ICONS.logout}
                          style={gradientHeaderStyle.logoutIcon}
                        />
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
