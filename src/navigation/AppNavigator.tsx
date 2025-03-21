// src/navigation/AppNavigator.tsx
import React from 'react';
import {useAppSelector} from '../hooks/useStore';
import AuthNavigator from './stack/auth/AuthNavigator';
import MainNavigator from './stack/main/MainNavigator';

const AppNavigator = () => {
  const {user} = useAppSelector(state => state.auth);
  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
