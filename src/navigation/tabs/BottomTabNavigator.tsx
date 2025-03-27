// src/navigation/tabs/BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {BottomTabParamList} from '../../constants/types';
import {ICONS} from '../../constants/icons';
import {COLORS} from '../../constants/colors';
import ChatList from '../../screens/chatList/ChatList'; // ChatList as "Messages"
import Contacts from '../../screens/contacts/Contacts';
import SettingsStack from '../stack/settings/SettingsStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Messages"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconSource;
          if (route.name === 'Messages') {
            iconSource = ICONS.message;
          } else if (route.name === 'Contacts') {
            iconSource = ICONS.contacts;
          } else if (route.name === 'Settings') {
            iconSource = ICONS.settings;
          }
          return (
            <Image
              source={iconSource}
              style={{width: size, height: size, tintColor: color}}
            />
          );
        },
        tabBarActiveTintColor: COLORS.darkBlue,
        tabBarInactiveTintColor: COLORS.black,
      })}>
      <Tab.Screen name="Messages" component={ChatList} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
