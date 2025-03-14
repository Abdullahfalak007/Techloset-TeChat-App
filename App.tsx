// // src/App.tsx
// import React, {useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import SplashScreen from 'react-native-splash-screen';
// import AppNavigator from './src/navigation/AppNavigator';
// import {Provider} from 'react-redux';
// import {store} from './src/store/store';
// import Toast from 'react-native-toast-message';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

// const App = () => {
//   useEffect(() => {
//     SplashScreen.hide();

//     GoogleSignin.configure({
//       webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
//     });
//   }, []);

//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//       <Toast />
//     </Provider>
//   );
// };

// export default App;

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

const App = () => {
  useEffect(() => {
    SplashScreen.hide();

    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
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
