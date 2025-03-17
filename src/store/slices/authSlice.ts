// src/store/slices/authSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

/**
 * Convert an image URL to a base64 string.
 * Returns null if photoURL is missing or on error.
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

/**
 * Write or update the user doc in Firestore.
 * Using merge: true so we don't overwrite existing fields.
 */
async function writeUserToFirestore(userObj: {
  uid: string;
  email: string; // forced to non-null
  displayName: string | null;
  photoURL: string | null;
  base64Photo: string | null;
}) {
  await firestore()
    .collection('users')
    .doc(userObj.uid)
    .set(userObj, {merge: true});
}

// Define your authentication slice shape
interface AuthState {
  user: any | null; // user object includes base64Photo
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

      const finalEmail = userEmail || ''; // fallback to empty string
      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      const userObj = {
        uid,
        email: finalEmail,
        displayName,
        photoURL,
        base64Photo,
      };

      // Write to Firestore
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
      // Create user in Firebase Auth
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
      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      const userObj = {
        uid,
        email: finalEmail,
        displayName,
        photoURL,
        base64Photo,
      };

      // Write to Firestore
      await firestore().collection('users').doc(uid).set(userObj);

      return userObj;
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
      const finalEmail = email || '';
      let base64Photo = null;
      if (photoURL) {
        base64Photo = await fetchBase64Image(photoURL);
      }

      const userObj = {
        uid,
        email: finalEmail,
        displayName,
        photoURL,
        base64Photo,
      };

      // Write to Firestore
      await writeUserToFirestore(userObj);

      return userObj;
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
