import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from '../../../screens/settings/Settings';
import Profile from '../../../screens/profile/Profile';
import ChangePassword from '../../../screens/changePassword/ChangePassword';
import {SettingsStackParamList} from '../../../constants/types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
