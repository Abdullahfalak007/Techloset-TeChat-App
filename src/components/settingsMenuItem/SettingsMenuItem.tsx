import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {settingsMenuItemStyles} from './settingsMenuItemStyles';
import UserAvatar from '../userAvatar/UserAvatar';
import {SettingsMenuItemProps} from '../../constants/types';

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({item, onPress}) => {
  return (
    <TouchableOpacity style={settingsMenuItemStyles.menuItem} onPress={onPress}>
      <View style={settingsMenuItemStyles.menuItemLeft}>
        <View style={settingsMenuItemStyles.iconBackground}>
          {item.icon && (
            <UserAvatar
              source={item.icon}
              style={settingsMenuItemStyles.menuIcon}
            />
          )}
        </View>
        <View style={{marginLeft: 12}}>
          <Text style={settingsMenuItemStyles.menuTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={settingsMenuItemStyles.menuSubtitle}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsMenuItem;
