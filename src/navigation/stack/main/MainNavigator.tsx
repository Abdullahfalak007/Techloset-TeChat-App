import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../constants/types';
import BottomTabNavigator from '../../tabs/BottomTabNavigator';
import Conversation from '../../../screens/conversation/Conversation';
import Profile from '../../../screens/profile/Profile';
import ChangePassword from '../../../screens/changePassword/ChangePassword';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
