// // src/store/slices/authSlice.ts
// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import auth from '@react-native-firebase/auth';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import Toast from 'react-native-toast-message';
// import {ToastAndroid} from 'react-native';

// // Define your authentication state shape
// interface AuthState {
//   user: any | null;
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
//       // return userCredential.user;

//       // Extract only serializable fields
//       const {
//         uid,
//         email: userEmail,
//         displayName,
//         photoURL,
//       } = userCredential.user;
//       return {uid, email: userEmail, displayName, photoURL};
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
//       // Optionally update the user's display name
//       await userCredential.user.updateProfile({displayName: name});
//       // return userCredential.user;

//       // Extract only serializable fields
//       const {
//         uid,
//         email: userEmail,
//         displayName,
//         photoURL,
//       } = userCredential.user;
//       return {uid, email: userEmail, displayName, photoURL};
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
//       // Check for Play Services and show update dialog if needed.
//       await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
//       // Ensure a fresh sign-in by signing out any previously signed-in user.
//       await GoogleSignin.signOut();

//       // Attempt to sign in.
//       const signInResponse = await GoogleSignin.signIn();
//       // Destructure the response to get data (which should contain the idToken)
//       const {data} = signInResponse;

//       if (!data?.idToken) {
//         throw new Error('Google Sign-In failed: idToken is null.');
//       }

//       // Create a Firebase credential with the idToken.
//       const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
//       const response = await auth().signInWithCredential(googleCredential);
//       const {uid, email, displayName, photoURL} = response.user;

//       // Return the desired user properties.
//       return {uid, email, displayName, photoURL};
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

// // Async thunk for password reset
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
//     // loginWithEmail lifecycle
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

//     // signupWithEmail lifecycle
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

//     // signInWithGoogle lifecycle
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

//     // resetPassword lifecycle (if you want to handle loading/error for password reset)
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
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import {ToastAndroid} from 'react-native';

/** Convert an image URL to a base64 string */
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

// Define your authentication state shape
interface AuthState {
  user: any | null; // user now includes base64Photo
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

// Async thunk for logging in with email/password
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
        photoURL,
      } = userCredential.user;

      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      return {uid, email: userEmail, displayName, photoURL, base64Photo};
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

      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      return {uid, email: userEmail, displayName, photoURL, base64Photo};
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

// Async thunk for Google Sign-In
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
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
      const {uid, email, displayName, photoURL} = response.user;

      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      return {uid, email, displayName, photoURL, base64Photo};
    } catch (err: any) {
      console.error('signInWithGoogle error:', err);
      Toast.show({
        type: 'error',
        text1: 'Google login failed. Please try again.',
        text2: err.message || 'An unknown error occurred',
      });
      return rejectWithValue(err.message || 'An unknown error occurred');
    }
  },
);

// Async thunk for password reset
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
    builder.addCase(signInWithGoogle.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signInWithGoogle.rejected, (state, action) => {
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
