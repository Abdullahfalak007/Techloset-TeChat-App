// src/screens/settings/Settings.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../constants/types';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useAppSelector} from '../../hooks/useStore';
import {COLORS} from '../../constants/colors';
import {ICONS} from '../../constants/icons';

import {
  DEFAULT_USER_NAME,
  DEFAULT_USER_STATUS,
  SETTINGS_MENU_ITEMS,
} from '../../constants/appConstants';

const Settings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {user} = useAppSelector(state => state.auth);

  const nameToDisplay = user?.displayName || DEFAULT_USER_NAME;
  const statusToDisplay = user?.status || DEFAULT_USER_STATUS;

  const renderMenuItem = ({item}: any) => {
    const handlePress = () => {
      // Check the item.id or item.title to decide where to navigate
      if (item.id === 'changePassword') {
        navigation.navigate('ChangePassword');
      } else {
        // Handle other menu items
        console.log(item.title);
      }
    };

    return (
      <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
        <View style={styles.menuItemLeft}>
          <View style={styles.iconBackground}>
            {item.icon && <Image source={item.icon} style={styles.menuIcon} />}
          </View>
          <View style={{marginLeft: 12}}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Settings"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.roundedContainer}>
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => navigation.navigate('Profile')}>
          {user?.photoURL ? (
            <Image source={{uri: user.photoURL}} style={styles.userAvatar} />
          ) : (
            <Image source={ICONS.avatar} style={styles.userAvatar} />
          )}
          <View style={{marginLeft: 16}}>
            <Text style={styles.userName}>{nameToDisplay}</Text>
            <Text style={styles.userStatus}>{statusToDisplay}</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={SETTINGS_MENU_ITEMS}
          keyExtractor={item => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginTop: -20,
    marginBottom: 20,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    borderBottomColor: COLORS.greyTextSubtitle,
    borderBottomWidth: 1,
  },
  // Increased user avatar size
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  userStatus: {
    fontSize: 12,
    color: COLORS.greyTextSubtitle,
    fontWeight: '400',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // New wrapper for menu icons with a background color
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.bubbleOwnGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.gradientEnd,
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.greyTextSubtitle,
    marginTop: 2,
  },
});
