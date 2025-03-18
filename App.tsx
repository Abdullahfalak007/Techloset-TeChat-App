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
import firestore from '@react-native-firebase/firestore';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email', 'openid'],
    });

    // Disable Firestore offline caching to avoid stale data
    firestore().settings({persistence: false});
    firestore()
      .clearPersistence()
      .then(() => console.log('Firestore cache cleared'))
      .catch(err => console.error('Failed to clear Firestore cache:', err));

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
