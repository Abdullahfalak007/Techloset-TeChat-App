import React, {useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useSettings} from './useSettings';
import {settingsStyles} from '../../styles/settingsStyle';
import {ICONS} from '../../constants/icons';

const Settings: React.FC = () => {
  const {navigation, user, nameToDisplay, statusToDisplay, settingsMenuItems} =
    useSettings();

  const renderMenuItem = useCallback(
    ({item}: {item: any}) => {
      const handlePress = () => {
        if (item.id === 'changePassword') {
          navigation.navigate('ChangePassword');
        } else {
          // Handle other menu items
          console.log(item.title);
        }
      };

      return (
        <TouchableOpacity style={settingsStyles.menuItem} onPress={handlePress}>
          <View style={settingsStyles.menuItemLeft}>
            <View style={settingsStyles.iconBackground}>
              {item.icon && (
                <Image source={item.icon} style={settingsStyles.menuIcon} />
              )}
            </View>
            <View style={{marginLeft: 12}}>
              <Text style={settingsStyles.menuTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={settingsStyles.menuSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  return (
    <View style={settingsStyles.container}>
      <GradientHeader
        title="Settings"
        isScreenWithBackArrow
        onBackPress={() => navigation.goBack()}
      />

      <View style={settingsStyles.roundedContainer}>
        <TouchableOpacity
          style={settingsStyles.userCard}
          onPress={() => navigation.navigate('Profile')}>
          {user?.photoURL ? (
            <Image
              source={{uri: user.photoURL}}
              style={settingsStyles.userAvatar}
            />
          ) : (
            <Image source={ICONS.avatar} style={settingsStyles.userAvatar} />
          )}
          <View style={{marginLeft: 16}}>
            <Text style={settingsStyles.userName}>{nameToDisplay}</Text>
            <Text style={settingsStyles.userStatus}>{statusToDisplay}</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={settingsMenuItems}
          keyExtractor={item => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </View>
  );
};

export default Settings;
