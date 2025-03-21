// // // src/store/slices/authSlice.ts
// // import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// // import auth from '@react-native-firebase/auth';
// // import firestore from '@react-native-firebase/firestore';
// // import {GoogleSignin} from '@react-native-google-signin/google-signin';
// // import Toast from 'react-native-toast-message';

// // /**
// //  * Convert an image URL to a base64 string.
// //  * Returns null if photoURL is missing or on error.
// //  */
// // async function fetchBase64Image(photoURL: string): Promise<string | null> {
// //   try {
// //     const response = await fetch(photoURL);
// //     const blob = await response.blob();
// //     return await new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.onloadend = () => resolve(reader.result as string);
// //       reader.onerror = reject;
// //       reader.readAsDataURL(blob);
// //     });
// //   } catch (error) {
// //     console.error('Error converting photoURL to base64:', error);
// //     return null;
// //   }
// // }

// // /**
// //  * Write or update the user doc in Firestore.
// //  * Using merge: true so we don't overwrite existing fields.
// //  */
// // async function writeUserToFirestore(userObj: {
// //   uid: string;
// //   email: string; // forced to non-null
// //   displayName: string | null;
// //   photoURL: string | null;
// //   base64Photo: string | null;
// // }) {
// //   await firestore()
// //     .collection('users')
// //     .doc(userObj.uid)
// //     .set(userObj, {merge: true});
// // }

// // // Define your authentication slice shape
// // interface AuthState {
// //   user: any | null; // user object includes base64Photo
// //   loading: boolean;
// //   error: string | null;
// //   idToken: string | null;
// // }

// // const initialState: AuthState = {
// //   user: null,
// //   loading: false,
// //   error: null,
// //   idToken: null,
// // };

// // // Async thunk for logging in with email/password
// // export const loginWithEmail = createAsyncThunk(
// //   'auth/loginWithEmail',
// //   async (
// //     {email, password}: {email: string; password: string},
// //     {rejectWithValue},
// //   ) => {
// //     try {
// //       const userCredential = await auth().signInWithEmailAndPassword(
// //         email,
// //         password,
// //       );
// //       const {
// //         uid,
// //         email: userEmail,
// //         displayName,
// //         photoURL,
// //       } = userCredential.user;

// //       const finalEmail = userEmail || ''; // fallback to empty string
// //       let base64Photo = null;
// //       if (photoURL) {
// //         base64Photo = await fetchBase64Image(photoURL);
// //       }

// //       const userObj = {
// //         uid,
// //         email: finalEmail,
// //         displayName,
// //         photoURL,
// //         base64Photo,
// //       };

// //       // Write to Firestore
// //       await writeUserToFirestore(userObj);

// //       return userObj;
// //     } catch (error) {
// //       if (error instanceof Error) {
// //         return rejectWithValue(error.message);
// //       }
// //       return rejectWithValue('An unknown error occurred');
// //     }
// //   },
// // );

// // // Async thunk for signing up with email/password
// // export const signupWithEmail = createAsyncThunk(
// //   'auth/signupWithEmail',
// //   async (
// //     {email, password, name}: {email: string; password: string; name: string},
// //     {rejectWithValue},
// //   ) => {
// //     try {
// //       // Create user in Firebase Auth
// //       const userCredential = await auth().createUserWithEmailAndPassword(
// //         email,
// //         password,
// //       );
// //       await userCredential.user.updateProfile({displayName: name});

// //       const {
// //         uid,
// //         email: userEmail,
// //         displayName,
// //         photoURL,
// //       } = userCredential.user;
// //       const finalEmail = userEmail || '';
// //       let base64Photo = null;
// //       if (photoURL) {
// //         base64Photo = await fetchBase64Image(photoURL);
// //       }

// //       const userObj = {
// //         uid,
// //         email: finalEmail,
// //         displayName,
// //         photoURL,
// //         base64Photo,
// //       };

// //       // Write to Firestore
// //       await firestore().collection('users').doc(uid).set(userObj);

// //       return userObj;
// //     } catch (error) {
// //       if (error instanceof Error) {
// //         return rejectWithValue(error.message);
// //       }
// //       return rejectWithValue('An unknown error occurred');
// //     }
// //   },
// // );

// // // Async thunk for Google Sign-In
// // export const signInWithGoogle = createAsyncThunk(
// //   'auth/signInWithGoogle',
// //   async (_, {rejectWithValue}) => {
// //     try {
// //       await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
// //       await GoogleSignin.signOut();
// //       const signInResponse = await GoogleSignin.signIn();
// //       const {data} = signInResponse;
// //       if (!data?.idToken) {
// //         throw new Error('Google Sign-In failed: idToken is null.');
// //       }

// //       const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
// //       const response = await auth().signInWithCredential(googleCredential);

// //       const {uid, email, displayName, photoURL} = response.user;
// //       const finalEmail = email || '';
// //       let base64Photo = null;
// //       if (photoURL) {
// //         base64Photo = await fetchBase64Image(photoURL);
// //       }

// //       const userObj = {
// //         uid,
// //         email: finalEmail,
// //         displayName,
// //         photoURL,
// //         base64Photo,
// //       };

// //       // Write to Firestore
// //       await writeUserToFirestore(userObj);

// //       return userObj;
// //     } catch (err: any) {
// //       console.error('signInWithGoogle error:', err);
// //       Toast.show({
// //         type: 'error',
// //         text1: 'Google login failed. Please try again.',
// //         text2: err.message || 'An unknown error occurred',
// //       });
// //       return rejectWithValue(err.message || 'An unknown error occurred');
// //     }
// //   },
// // );

// // // Async thunk for password reset
// // export const resetPassword = createAsyncThunk(
// //   'auth/resetPassword',
// //   async ({email}: {email: string}, {rejectWithValue}) => {
// //     try {
// //       await auth().sendPasswordResetEmail(email);
// //       return email;
// //     } catch (error) {
// //       if (error instanceof Error) {
// //         return rejectWithValue(error.message);
// //       }
// //       return rejectWithValue('An unknown error occurred');
// //     }
// //   },
// // );

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState,
// //   reducers: {
// //     signOut(state) {
// //       state.user = null;
// //       state.error = null;
// //     },
// //     setUser(state, action) {
// //       state.user = action.payload;
// //     },
// //   },
// //   extraReducers: builder => {
// //     // loginWithEmail
// //     builder.addCase(loginWithEmail.pending, state => {
// //       state.loading = true;
// //       state.error = null;
// //     });
// //     builder.addCase(loginWithEmail.fulfilled, (state, action) => {
// //       state.loading = false;
// //       state.user = action.payload;
// //     });
// //     builder.addCase(loginWithEmail.rejected, (state, action) => {
// //       state.loading = false;
// //       state.error = action.payload as string;
// //     });

// //     // signupWithEmail
// //     builder.addCase(signupWithEmail.pending, state => {
// //       state.loading = true;
// //       state.error = null;
// //     });
// //     builder.addCase(signupWithEmail.fulfilled, (state, action) => {
// //       state.loading = false;
// //       state.user = action.payload;
// //     });
// //     builder.addCase(signupWithEmail.rejected, (state, action) => {
// //       state.loading = false;
// //       state.error = action.payload as string;
// //     });

// //     // signInWithGoogle
// //     builder.addCase(signInWithGoogle.pending, state => {
// //       state.loading = true;
// //       state.error = null;
// //     });
// //     builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
// //       state.loading = false;
// //       state.user = action.payload;
// //     });
// //     builder.addCase(signInWithGoogle.rejected, (state, action) => {
// //       state.loading = false;
// //       state.error = action.payload as string;
// //     });

// //     // resetPassword
// //     builder.addCase(resetPassword.pending, state => {
// //       state.loading = true;
// //       state.error = null;
// //     });
// //     builder.addCase(resetPassword.fulfilled, state => {
// //       state.loading = false;
// //     });
// //     builder.addCase(resetPassword.rejected, (state, action) => {
// //       state.loading = false;
// //       state.error = action.payload as string;
// //     });
// //   },
// // });

// // export const {signOut, setUser} = authSlice.actions;
// // export default authSlice.reducer;

// // src/store/slices/authSlice.ts
// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import Toast from 'react-native-toast-message';

// //
// // 1) Define a User interface with a dynamic status field
// //
// interface User {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   base64Photo: string | null;
//   status: string | null;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   idToken: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
//   idToken: null,
// };

// //
// // 2) Utility functions
// //

// /** Convert an image URL to a base64 string. */
// async function fetchBase64Image(photoURL: string): Promise<string | null> {
//   try {
//     const response = await fetch(photoURL);
//     const blob = await response.blob();
//     return await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error('Error converting photoURL to base64:', error);
//     return null;
//   }
// }

// /** Write or update the user doc in Firestore (using merge to avoid overwriting fields). */
// async function writeUserToFirestore(userObj: User) {
//   await firestore()
//     .collection('users')
//     .doc(userObj.uid)
//     .set(userObj, {merge: true});
// }

// /**
//  * Fetch the user's status from Firestore if it exists.
//  * If not, return a default status.
//  */
// async function fetchStatusFromFirestoreOrDefault(uid: string): Promise<string> {
//   const docRef = firestore().collection('users').doc(uid);
//   const docSnap = await docRef.get();
//   if (docSnap.exists) {
//     const data = docSnap.data();
//     if (data?.status) {
//       return data.status;
//     }
//   }
//   return 'Never give up 💪'; // default status
// }

// //
// // 3) Thunks with dynamic status handling
// //

// // Async thunk for logging in with email/password
// export const loginWithEmail = createAsyncThunk(
//   'auth/loginWithEmail',
//   async (
//     {email, password}: {email: string; password: string},
//     {rejectWithValue},
//   ) => {
//     try {
//       const userCredential = await auth().signInWithEmailAndPassword(
//         email,
//         password,
//       );
//       const {
//         uid,
//         email: userEmail,
//         displayName,
//         photoURL,
//       } = userCredential.user;
//       const finalEmail = userEmail || '';
//       let base64Photo = null;
//       if (photoURL) {
//         base64Photo = await fetchBase64Image(photoURL);
//       }
//       // Retrieve status dynamically from Firestore or use default
//       const status = await fetchStatusFromFirestoreOrDefault(uid);
//       const userObj: User = {
//         uid,
//         email: finalEmail,
//         displayName,
//         photoURL,
//         base64Photo,
//         status,
//       };
//       await writeUserToFirestore(userObj);
//       return userObj;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   },
// );

// // Async thunk for signing up with email/password
// export const signupWithEmail = createAsyncThunk(
//   'auth/signupWithEmail',
//   async (
//     {email, password, name}: {email: string; password: string; name: string},
//     {rejectWithValue},
//   ) => {
//     try {
//       const userCredential = await auth().createUserWithEmailAndPassword(
//         email,
//         password,
//       );
//       await userCredential.user.updateProfile({displayName: name});
//       const {
//         uid,
//         email: userEmail,
//         displayName,
//         photoURL,
//       } = userCredential.user;
//       const finalEmail = userEmail || '';
//       let base64Photo = null;
//       if (photoURL) {
//         base64Photo = await fetchBase64Image(photoURL);
//       }
//       // For a new user, fetchStatusFromFirestoreOrDefault will return the default
//       const status = await fetchStatusFromFirestoreOrDefault(uid);
//       const userObj: User = {
//         uid,
//         email: finalEmail,
//         displayName,
//         photoURL,
//         base64Photo,
//         status,
//       };
//       await writeUserToFirestore(userObj);
//       return userObj;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   },
// );

// // Async thunk for Google Sign-In
// export const signInWithGoogle = createAsyncThunk(
//   'auth/signInWithGoogle',
//   async (_, {rejectWithValue}) => {
//     try {
//       await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
//       await GoogleSignin.signOut();
//       const signInResponse = await GoogleSignin.signIn();
//       const {data} = signInResponse;
//       if (!data?.idToken) {
//         throw new Error('Google Sign-In failed: idToken is null.');
//       }
//       const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
//       const response = await auth().signInWithCredential(googleCredential);
//       const {uid, email, displayName, photoURL} = response.user;
//       const finalEmail = email || '';
//       let base64Photo = null;
//       if (photoURL) {
//         base64Photo = await fetchBase64Image(photoURL);
//       }
//       const status = await fetchStatusFromFirestoreOrDefault(uid);
//       const userObj: User = {
//         uid,
//         email: finalEmail,
//         displayName,
//         photoURL,
//         base64Photo,
//         status,
//       };
//       await writeUserToFirestore(userObj);
//       return userObj;
//     } catch (err: any) {
//       console.error('signInWithGoogle error:', err);
//       Toast.show({
//         type: 'error',
//         text1: 'Google login failed. Please try again.',
//         text2: err.message || 'An unknown error occurred',
//       });
//       return rejectWithValue(err.message || 'An unknown error occurred');
//     }
//   },
// );

// // Async thunk for password reset remains unchanged
// export const resetPassword = createAsyncThunk(
//   'auth/resetPassword',
//   async ({email}: {email: string}, {rejectWithValue}) => {
//     try {
//       await auth().sendPasswordResetEmail(email);
//       return email;
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   },
// );

// //
// // 4) Slice definition
// //
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     signOut(state) {
//       state.user = null;
//       state.error = null;
//     },
//     setUser(state, action) {
//       state.user = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     // loginWithEmail
//     builder.addCase(loginWithEmail.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(loginWithEmail.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload;
//     });
//     builder.addCase(loginWithEmail.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // signupWithEmail
//     builder.addCase(signupWithEmail.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(signupWithEmail.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload;
//     });
//     builder.addCase(signupWithEmail.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // signInWithGoogle
//     builder.addCase(signInWithGoogle.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload;
//     });
//     builder.addCase(signInWithGoogle.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // resetPassword
//     builder.addCase(resetPassword.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(resetPassword.fulfilled, state => {
//       state.loading = false;
//     });
//     builder.addCase(resetPassword.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export const {signOut, setUser} = authSlice.actions;
// export default authSlice.reducer;

// src/store/slices/authSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

//
// 1) Define a User interface without base64Photo
//
interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null; // This field will hold either a normal URL or a base64 data URI.
  status: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  idToken: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  idToken: null,
};

//
// 2) Utility functions
//

/** (Optional) Convert an image URL to a base64 string.
 * You can remove this if you don't need it in your auth logic.
 */
async function fetchBase64Image(photoURL: string): Promise<string | null> {
  try {
    const response = await fetch(photoURL);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting photoURL to base64:', error);
    return null;
  }
}

/** Write or update the user doc in Firestore (using merge to avoid overwriting fields). */
async function writeUserToFirestore(userObj: User) {
  await firestore()
    .collection('users')
    .doc(userObj.uid)
    .set(userObj, {merge: true});
}

/**
 * Fetch the user's status from Firestore if it exists.
 * If not, return a default status.
 */
async function fetchStatusFromFirestoreOrDefault(uid: string): Promise<string> {
  const docRef = firestore().collection('users').doc(uid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data?.status) {
      return data.status;
    }
  }
  return 'Never give up 💪'; // default status
}

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const {
        uid,
        email: userEmail,
        displayName,
        photoURL: authPhotoURL, // from Firebase Auth
      } = userCredential.user;
      const finalEmail = userEmail || '';

      // Check Firestore to see if we already have a photoURL stored (e.g., base64 image)
      const docRef = firestore().collection('users').doc(uid);
      const docSnap = await docRef.get();
      let finalPhotoURL = authPhotoURL;
      if (docSnap.exists && docSnap.data()?.photoURL) {
        finalPhotoURL = docSnap.data()?.photoURL;
      }

      // Retrieve status dynamically from Firestore or use default.
      const status = await fetchStatusFromFirestoreOrDefault(uid);

      const userObj: User = {
        uid,
        email: finalEmail,
        displayName,
        photoURL: finalPhotoURL, // use the value from Firestore if available.
        status,
      };

      // Write/merge to Firestore so that if the user never updated their avatar,
      // we store the Auth photoURL.
      await writeUserToFirestore(userObj);
      return userObj;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Async thunk for signing up with email/password
export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async (
    {email, password, name}: {email: string; password: string; name: string},
    {rejectWithValue},
  ) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.updateProfile({displayName: name});
      const {
        uid,
        email: userEmail,
        displayName,
        photoURL,
      } = userCredential.user;
      const finalEmail = userEmail || '';
      const status = await fetchStatusFromFirestoreOrDefault(uid);
      const userObj: User = {
        uid,
        email: finalEmail,
        displayName,
        photoURL,
        status,
      };
      await writeUserToFirestore(userObj);
      return userObj;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// // Async thunk for Google Log-In
// export const signInWithGoogle = createAsyncThunk(
//   'auth/signInWithGoogle',
//   async (_, {rejectWithValue}) => {
//     try {
//       await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
//       await GoogleSignin.signOut();
//       const signInResponse = await GoogleSignin.signIn();
//       const {data} = signInResponse;
//       if (!data?.idToken) {
//         throw new Error('Google Sign-In failed: idToken is null.');
//       }
//       const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
//       const response = await auth().signInWithCredential(googleCredential);
//       const {uid, email, displayName, photoURL} = response.user;
//       const finalEmail = email || '';
//       const status = await fetchStatusFromFirestoreOrDefault(uid);
//       const userObj: User = {
//         uid,
//         email: finalEmail,
//         displayName,
//         photoURL,
//         status,
//       };
//       await writeUserToFirestore(userObj);
//       return userObj;
//     } catch (err: any) {
//       console.error('signInWithGoogle error:', err);
//       Toast.show({
//         type: 'error',
//         text1: 'Google login failed. Please try again.',
//         text2: err.message || 'An unknown error occurred',
//       });
//       return rejectWithValue(err.message || 'An unknown error occurred');
//     }
//   },
// );

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, {rejectWithValue}) => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      await GoogleSignin.signOut();
      const signInResponse = await GoogleSignin.signIn();
      const {data} = signInResponse;
      if (!data?.idToken) {
        throw new Error('Google Sign-In failed: idToken is null.');
      }
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      const response = await auth().signInWithCredential(googleCredential);
      const {uid, email, displayName, photoURL: authPhotoURL} = response.user;
      const finalEmail = email || '';

      // Check Firestore to see if a user doc exists for this uid.
      const docRef = firestore().collection('users').doc(uid);
      const docSnap = await docRef.get();
      let userObj;
      if (docSnap.exists) {
        // User exists in Firestore—use the stored data (which may contain an updated base64 image).
        const data = docSnap.data();
        userObj = {
          uid,
          email: finalEmail,
          displayName: data?.displayName || displayName,
          photoURL: data?.photoURL || authPhotoURL,
          status:
            data?.status || (await fetchStatusFromFirestoreOrDefault(uid)),
        };
      } else {
        // User does not exist in Firestore—create a new document.
        const status = await fetchStatusFromFirestoreOrDefault(uid);
        userObj = {
          uid,
          email: finalEmail,
          displayName,
          photoURL: authPhotoURL,
          status,
        };
        await writeUserToFirestore(userObj);
      }
      return userObj;
    } catch (err: any) {
      console.error('loginWithGoogle error:', err);
      Toast.show({
        type: 'error',
        text1: 'Google login failed',
        text2: err.message || 'An unknown error occurred',
      });
      return rejectWithValue(err.message || 'An unknown error occurred');
    }
  },
);

// Async thunk for sign-up with google

export const signupWithGoogle = createAsyncThunk(
  'auth/signupWithGoogle',
  async (_, {rejectWithValue}) => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      await GoogleSignin.signOut();
      const signInResponse = await GoogleSignin.signIn();
      const {data} = signInResponse;
      if (!data?.idToken) {
        throw new Error('Google Sign-In failed: idToken is null.');
      }
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      const response = await auth().signInWithCredential(googleCredential);
      const {uid, email, displayName, photoURL: authPhotoURL} = response.user;
      const finalEmail = email || '';

      // Query Firestore to check if a user with this email already exists.
      const querySnap = await firestore()
        .collection('users')
        .where('email', '==', finalEmail)
        .get();

      if (!querySnap.empty) {
        // User already exists: notify and log in using existing data.
        Toast.show({
          type: 'info',
          text1: 'User Already Registered',
          text2: 'Logged in instead!',
        });
        const existingDoc = querySnap.docs[0].data();
        const existingUser = {
          uid: existingDoc.uid,
          email: existingDoc.email,
          displayName: existingDoc.displayName,
          photoURL: existingDoc.photoURL || authPhotoURL,
          status:
            existingDoc.status ||
            (await fetchStatusFromFirestoreOrDefault(uid)),
        };
        return existingUser;
      }

      // If no document exists, proceed to create a new user doc.
      const status = await fetchStatusFromFirestoreOrDefault(uid);
      const userObj = {
        uid,
        email: finalEmail,
        displayName,
        photoURL: authPhotoURL,
        status,
      };
      await writeUserToFirestore(userObj);
      return userObj;
    } catch (err: any) {
      console.error('signupWithGoogle error:', err);
      Toast.show({
        type: 'error',
        text1: 'Google signup failed',
        text2: err.message || 'An unknown error occurred',
      });
      return rejectWithValue(err.message || 'An unknown error occurred');
    }
  },
);

// Async thunk for password reset remains unchanged
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({email}: {email: string}, {rejectWithValue}) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return email;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

//
// 4) Slice definition
//
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.user = null;
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    // loginWithEmail
    builder.addCase(loginWithEmail.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // signupWithEmail
    builder.addCase(signupWithEmail.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signupWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // signInWithGoogle
    builder.addCase(signupWithGoogle.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signupWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // signInWithGoogle
    builder.addCase(loginWithGoogle.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // resetPassword
    builder.addCase(resetPassword.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {signOut, setUser} = authSlice.actions;
export default authSlice.reducer;
