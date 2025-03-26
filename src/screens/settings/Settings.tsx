import React, {useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import GradientHeader from '../../components/gradientHeader/GradientHeader';
import {useSettings} from './useSettings';
import {settingsStyles} from '../../styles/settingsStyle';
import {ICONS} from '../../constants/icons';
import UserAvatar from '../../components/userAvatar/UserAvatar';
import SettingsMenuItem from '../../components/settingsMenuItem/SettingsMenuItem';

const Settings: React.FC = () => {
  const {navigation, user, nameToDisplay, statusToDisplay, settingsMenuItems} =
    useSettings();

  const renderMenuItem = useCallback(
    ({item}: {item: any}) => {
      const handlePress = () => {
        if (item.id === 'changePassword') {
          navigation.navigate('ChangePassword');
        } else {
          console.log(item.title);
        }
      };

      return <SettingsMenuItem item={item} onPress={handlePress} />;
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
          <UserAvatar
            source={user?.photoURL ? user.photoURL : ICONS.avatar}
            style={settingsStyles.userAvatar}
          />
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
