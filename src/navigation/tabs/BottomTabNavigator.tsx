// src/navigation/tabs/BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {BottomTabParamList} from '../../constants/types';
import {ICONS} from '../../constants';
import {COLORS} from '../../constants/colors';
import {Image} from 'react-native';
import Contacts from '../../screens/contacts/Contacts';
import Settings from '../../screens/settings/Settings';
import Message from '../../screens/messages/Messages';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconSource;
          if (route.name === 'Message') {
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
        tabBarActiveTintColor: COLORS.textColor,
        tabBarInactiveTintColor: COLORS.black,
      })}>
      <Tab.Screen
        name="Message"
        component={Message}
        options={{tabBarLabel: 'Message'}}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{tabBarLabel: 'Contacts'}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{tabBarLabel: 'Settings'}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
