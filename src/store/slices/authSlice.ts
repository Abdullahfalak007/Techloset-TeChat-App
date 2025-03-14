// src/store/slices/authSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import { AxiosError } from 'axios'; // if needed in other contexts
// import {WEB_CLIENT_ID} from '@env';

// Define your authentication state shape
interface AuthState {
  user: any | null; // You can later replace 'any' with your own AuthUser type
  loading: boolean;
  error: string | null;
  idToken: null;
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
      return userCredential.user;
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
      // Optionally update the user's display name
      await userCredential.user.updateProfile({displayName: name});
      return userCredential.user;
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
      await GoogleSignin.hasPlayServices();
      // Cast the sign-in response 'any' to access idToken
      const googleResponse = (await GoogleSignin.signIn()) as any;
      const {idToken} = googleResponse;
      if (!idToken) {
        throw new Error('No idToken returned from Google Sign-In');
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      return userCredential.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
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
    // To sign out the user or manually set user state if needed
    signOut(state) {
      state.user = null;
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    // loginWithEmail lifecycle
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

    // signupWithEmail lifecycle
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

    // signInWithGoogle lifecycle
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

    // resetPassword lifecycle (if you want to handle loading/error for password reset)
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
