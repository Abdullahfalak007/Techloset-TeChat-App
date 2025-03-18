// src/App.tsx
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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
    // ✅ Wrap everything in GestureHandlerRootView
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
