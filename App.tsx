// src/App.tsx
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Toast from 'react-native-toast-message';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '@env';
import auth from '@react-native-firebase/auth';
import {signOut} from './src/store/slices/authSlice';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true, // This is necessary to get an idToken for server authentication
      scopes: ['profile', 'email', 'openid'],
    });

    // Listen for auth state changes. When there is no user, dispatch signOut.
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (!user) {
        store.dispatch(signOut());
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </Provider>
  );
};

export default App;
