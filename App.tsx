import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      {/* <StatusBar barStyle="light-content" backgroundColor="#2/3234C" /> */}
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
