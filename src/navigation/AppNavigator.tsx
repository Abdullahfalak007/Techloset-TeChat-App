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

// const [user, setUser] = useState<null | object>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged((authUser) => {
//       setUser(authUser);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }
