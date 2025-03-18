// // src/store/slices/chatSlice.ts
// import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
// import firestore from '@react-native-firebase/firestore';
// import {RootState, AppDispatch} from '../../store/store';

// /**
//  * The shape of a conversation document in Firestore
//  */
// export interface Conversation {
//   id: string;
//   participants: string[];
//   lastMessage: string;
//   updatedAt: any; // Firestore timestamp
//   recipientName: string;
//   recipientPhoto?: string | null;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: any; // Firestore timestamp
// }

// interface ChatState {
//   loading: boolean;
//   error: string | null;
//   conversations: Conversation[];
// }

// const initialState: ChatState = {
//   loading: false,
//   error: null,
//   conversations: [],
// };

// /**
//  * Create a new conversation or return an existing one
//  * between the current user (uid) and otherUid.
//  */
// export const createConversation = createAsyncThunk<
//   string, // conversationId
//   {uid: string; otherUid: string},
//   {rejectValue: string}
// >('chat/createConversation', async ({uid, otherUid}, {rejectWithValue}) => {
//   try {
//     // Check if conversation already exists
//     const existing = await firestore()
//       .collection('conversations')
//       .where('participants', 'array-contains', uid)
//       .get();

//     let conversationId: string | null = null;

//     existing.forEach(doc => {
//       const data = doc.data();
//       if (data.participants.includes(otherUid)) {
//         conversationId = doc.id;
//       }
//     });

//     if (conversationId) {
//       // Return existing conversation
//       return conversationId;
//     }

//     // Otherwise, create a new conversation
//     const convRef = await firestore()
//       .collection('conversations')
//       .add({
//         participants: [uid, otherUid],
//         lastMessage: '',
//         updatedAt: firestore.FieldValue.serverTimestamp(),
//       });

//     return convRef.id;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

// /**
//  * Send a message to an existing conversation
//  */
// export const sendMessage = createAsyncThunk<
//   void,
//   {conversationId: string; senderId: string; text: string},
//   {rejectValue: string}
// >(
//   'chat/sendMessage',
//   async ({conversationId, senderId, text}, {rejectWithValue}) => {
//     try {
//       // Add message doc to subcollection
//       await firestore()
//         .collection('conversations')
//         .doc(conversationId)
//         .collection('messages')
//         .add({
//           senderId,
//           text: text.trim(),
//           timestamp: firestore.FieldValue.serverTimestamp(),
//         });

//       // Update conversation lastMessage & updatedAt
//       await firestore().collection('conversations').doc(conversationId).update({
//         lastMessage: text.trim(),
//         updatedAt: firestore.FieldValue.serverTimestamp(),
//       });
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   },
// );

// // Reducer to update conversations in state.
// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     clearChatState(state) {
//       state.loading = false;
//       state.error = null;
//     },
//     setConversations(state, action: PayloadAction<Conversation[]>) {
//       state.conversations = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     // createConversation
//     builder.addCase(createConversation.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(createConversation.fulfilled, (state, action) => {
//       state.loading = false;
//       // The actual conversation doc is listened to in real-time,
//       // so we don't need to store it here directly
//     });
//     builder.addCase(createConversation.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // sendMessage
//     builder.addCase(sendMessage.pending, state => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(sendMessage.fulfilled, state => {
//       state.loading = false;
//     });
//     builder.addCase(sendMessage.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// export const {clearChatState, setConversations} = chatSlice.actions;
// export default chatSlice.reducer;

// /**
//  * Thunk to listen to all conversations for a user in real-time
//  */
// export const listenToUserConversations =
//   (uid: string) => (dispatch: AppDispatch, getState: () => RootState) => {
//     // Real-time listener
//     return firestore()
//       .collection('conversations')
//       .where('participants', 'array-contains', uid)
//       .orderBy('updatedAt', 'desc')
//       .onSnapshot(snapshot => {
//         const convs: Conversation[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           convs.push({
//             id: doc.id,
//             participants: data.participants,
//             lastMessage: data.lastMessage || '',
//             updatedAt: data.updatedAt,
//           });
//         });
//         // We directly update the store by returning an action:
//         dispatch({
//           type: 'chat/userConversationsReceived',
//           payload: convs,
//         });
//       });
//   };

// /**
//  * Thunk to listen to messages in a conversation in real-time
//  */
// export const listenToConversationMessages =
//   (conversationId: string) =>
//   (dispatch: AppDispatch, getState: () => RootState) => {
//     return firestore()
//       .collection('conversations')
//       .doc(conversationId)
//       .collection('messages')
//       .orderBy('timestamp', 'asc')
//       .onSnapshot(snapshot => {
//         const msgs: Message[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           if (data.timestamp) {
//             msgs.push({
//               id: doc.id,
//               senderId: data.senderId,
//               text: data.text,
//               timestamp: data.timestamp,
//             });
//           }
//         });
//         dispatch({
//           type: 'chat/conversationMessagesReceived',
//           payload: msgs,
//         });
//       });
//   };

// /**
//  * We'll handle these custom actions in a case reducer below
//  * (since we're dispatching plain objects, not from createAsyncThunk).
//  */

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: any; // Firestore timestamp
  recipientName: string;
  recipientPhoto?: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore timestamp
}

interface ChatState {
  loading: boolean;
  error: string | null;
  conversations: Conversation[];
}

const initialState: ChatState = {
  loading: false,
  error: null,
  conversations: [],
};

// Create a conversation between two users (if none exists)
export const createConversation = createAsyncThunk<
  string, // returns the conversationId
  {uid: string; otherUid: string},
  {rejectValue: string}
>('chat/createConversation', async ({uid, otherUid}, {rejectWithValue}) => {
  try {
    const existingSnapshot = await firestore()
      .collection('conversations')
      .where('participants', 'array-contains', uid)
      .get();

    let conversationId: string | null = null;
    existingSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.participants.includes(otherUid)) {
        conversationId = doc.id;
      }
    });

    if (conversationId) {
      return conversationId;
    }

    // If no conversation exists, create a new one with default recipient fields.
    const convRef = await firestore()
      .collection('conversations')
      .add({
        participants: [uid, otherUid],
        lastMessage: '',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        recipientName: 'Unknown', // Default value; later updated by hook if possible
        recipientPhoto: null,
      });

    return convRef.id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// (Keep your sendMessage thunk as is.)
export const sendMessage = createAsyncThunk<
  void,
  {conversationId: string; senderId: string; text: string},
  {rejectValue: string}
>(
  'chat/sendMessage',
  async ({conversationId, senderId, text}, {rejectWithValue}) => {
    try {
      // Add new message in the "messages" subcollection
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add({
          senderId,
          text: text.trim(),
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      // Update parent conversation's lastMessage and updatedAt
      await firestore().collection('conversations').doc(conversationId).update({
        lastMessage: text.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteConversation = createAsyncThunk<
  void,
  {conversationId: string},
  {rejectValue: string}
>('chat/deleteConversation', async ({conversationId}, {rejectWithValue}) => {
  try {
    const convRef = firestore().collection('conversations').doc(conversationId);

    // 1) Get all messages in subcollection
    const messagesSnap = await convRef.collection('messages').get();

    // 2) Use a batch to delete all messages + the conversation doc
    const batch = firestore().batch();
    messagesSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    batch.delete(convRef);

    // 3) Commit the batch
    await batch.commit();
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return rejectWithValue(error.message);
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatState(state) {
      state.loading = false;
      state.error = null;
    },
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createConversation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create conversation';
      })
      .addCase(sendMessage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send message';
      })
      .addCase(deleteConversation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, state => {
        state.loading = false;
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete conversation';
      });
  },
});

export const {clearChatState, setConversations} = chatSlice.actions;
export default chatSlice.reducer;
