// src/navigation/AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/login/Login';
import Auth from '../screens/auth/Auth';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
