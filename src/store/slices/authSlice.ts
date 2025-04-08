import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import {RootState} from '../store';
import {AuthState, User} from '../../constants/types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  idToken: null,
};

async function writeUserToFirestore(userObj: User): Promise<void> {
  await firestore()
    .collection('users')
    .doc(userObj.uid)
    .set(userObj, {merge: true});
}

async function fetchStatusFromFirestoreOrDefault(uid: string): Promise<string> {
  const docRef = firestore().collection('users').doc(uid);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data?.status) {
      return data.status;
    }
  }
  return 'No Status Added Yet.';
}

export const loginWithEmail = createAsyncThunk<
  User,
  {email: string; password: string},
  {rejectValue: string}
>('auth/loginWithEmail', async ({email, password}, {rejectWithValue}) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const {
      uid,
      email: userEmail,
      displayName,
      photoURL: authPhotoURL,
    } = userCredential.user;
    const finalEmail = userEmail || '';

    const docRef = firestore().collection('users').doc(uid);
    const docSnap = await docRef.get();
    let finalPhotoURL: string | null = null;
    if (docSnap.exists && docSnap.data()?.photoURL) {
      finalPhotoURL = docSnap.data()?.photoURL;
    } else if (authPhotoURL) {
      finalPhotoURL = authPhotoURL;
    }

    const status = await fetchStatusFromFirestoreOrDefault(uid);

    const userObj: User = {
      uid,
      email: finalEmail,
      displayName,
      photoURL: finalPhotoURL,
      status,
    };

    await writeUserToFirestore(userObj);
    return userObj;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const signupWithEmail = createAsyncThunk<
  User,
  {email: string; password: string; name: string},
  {rejectValue: string}
>(
  'auth/signupWithEmail',
  async ({email, password, name}, {rejectWithValue}) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user.updateProfile({displayName: name});
      const {uid, email: userEmail, photoURL} = userCredential.user;
      const finalEmail = userEmail || '';
      const status = await fetchStatusFromFirestoreOrDefault(uid);
      const finalPhotoURL = photoURL || null;
      const userObj: User = {
        uid,
        email: finalEmail,
        displayName: name,
        photoURL: finalPhotoURL,
        status,
      };

      await writeUserToFirestore(userObj);
      return userObj;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

export const loginWithGoogle = createAsyncThunk<
  User,
  void,
  {rejectValue: string}
>('auth/loginWithGoogle', async (_, {rejectWithValue}) => {
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
    const docRef = firestore().collection('users').doc(uid);
    const docSnap = await docRef.get();
    let userObj: User;
    if (docSnap.exists) {
      const data = docSnap.data();
      userObj = {
        uid,
        email: finalEmail,
        displayName: data?.displayName || displayName,
        photoURL: data?.photoURL || authPhotoURL,
        status: data?.status || (await fetchStatusFromFirestoreOrDefault(uid)),
      };
    } else {
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
  } catch (err: unknown) {
    console.error('loginWithGoogle error:', err);
    let errorMessage = 'An unknown error occurred';
    if (err instanceof Error) errorMessage = err.message;
    Toast.show({
      type: 'error',
      text1: 'Google login failed',
      text2: errorMessage,
    });
    return rejectWithValue(errorMessage);
  }
});

export const signupWithGoogle = createAsyncThunk<
  User,
  void,
  {rejectValue: string}
>('auth/signupWithGoogle', async (_, {rejectWithValue}) => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    await GoogleSignin.signOut();
    const signInResponse = await GoogleSignin.signIn();
    const {data} = signInResponse;
    if (!data?.idToken) {
      throw new Error('Google Sign-In failed: idToken is null.');
    }
    const googleCredential = auth.GoogleAuthProvider.credential(data?.idToken);
    const response = await auth().signInWithCredential(googleCredential);
    const {uid, email, displayName, photoURL: authPhotoURL} = response?.user;
    const finalEmail = email || '';
    const querySnap = await firestore()
      .collection('users')
      .where('email', '==', finalEmail)
      .get();

    if (!querySnap.empty) {
      Toast.show({
        type: 'info',
        text1: 'User Already Registered',
        text2: 'Logged in instead!',
      });
      const existingDoc = querySnap.docs[0]?.data();
      const existingUser: User = {
        uid: existingDoc?.uid,
        email: existingDoc?.email,
        displayName: existingDoc?.displayName,
        photoURL: existingDoc?.photoURL || authPhotoURL,
        status:
          existingDoc.status || (await fetchStatusFromFirestoreOrDefault(uid)),
      };
      return existingUser;
    }

    const status = await fetchStatusFromFirestoreOrDefault(uid);
    const userObj: User = {
      uid,
      email: finalEmail,
      displayName,
      photoURL: authPhotoURL,
      status,
    };
    await writeUserToFirestore(userObj);
    return userObj;
  } catch (err: unknown) {
    console.error('signupWithGoogle error:', err);
    let errorMessage = 'An unknown error occurred';
    if (err instanceof Error) errorMessage = err.message;
    Toast.show({
      type: 'error',
      text1: 'Google signup failed',
      text2: errorMessage,
    });
    return rejectWithValue(errorMessage);
  }
});

export const resetPassword = createAsyncThunk<
  string,
  {email: string},
  {rejectValue: string}
>('auth/resetPassword', async ({email}, {rejectWithValue}) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return email;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const changeUserPassword = createAsyncThunk<
  void,
  {currentPassword: string; newPassword: string},
  {rejectValue: string; state: RootState}
>(
  'auth/changeUserPassword',
  async ({currentPassword, newPassword}, {rejectWithValue, getState}) => {
    try {
      const {
        auth: {user},
      } = getState();
      if (!user || !user.email) {
        throw new Error('No authenticated user or missing email.');
      }
      const currentAuthUser = auth().currentUser;
      if (!currentAuthUser) {
        throw new Error('No current Firebase user.');
      }
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await currentAuthUser?.reauthenticateWithCredential(credential);
      await currentAuthUser?.updatePassword(newPassword);
    } catch (error: unknown) {
      console.error('changeUserPassword error:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update password.');
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
      state.error = action.payload || 'Failed to login';
    });

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
      state.error = action.payload || 'Failed to signup';
    });

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
      state.error = action.payload || 'Failed to signup with google';
    });

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
      state.error = action.payload || 'Failed to login with google';
    });

    builder.addCase(resetPassword.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to reset password';
    });

    builder.addCase(changeUserPassword.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changeUserPassword.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(changeUserPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update password';
    });
  },
});

export const {signOut, setUser} = authSlice.actions;
export default authSlice.reducer;
