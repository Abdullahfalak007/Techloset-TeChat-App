// src/navigation/stack/main/MainNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../constants/types';
import BottomTabNavigator from '../../tabs/BottomTabNavigator';
import Conversation from '../../../screens/conversation/Conversation';
import Profile from '../../../screens/profile/Profile';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* MainTabs holds the bottom tabs (Messages, Contacts, Settings) */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
