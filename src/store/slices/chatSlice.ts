// src/store/slices/chatSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: any; // Firestore timestamp
  recipientName: string;
  recipientPhoto?: string | null;
  unreadCounts?: Record<string, number>; // e.g. { userUid1: 0, userUid2: 1 }
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

// Thunk to create a new conversation with initial unreadCounts and recipient details.
export const createConversation = createAsyncThunk<
  string, // returns conversationId
  {uid: string; otherUid: string},
  {rejectValue: string}
>('chat/createConversation', async ({uid, otherUid}, {rejectWithValue}) => {
  try {
    // Check if a conversation already exists for the current user with the other user.
    const snapshot = await firestore()
      .collection('conversations')
      .where('participants', 'array-contains', uid)
      .get();

    let conversationId: string | null = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.participants.includes(otherUid)) {
        conversationId = doc.id;
      }
    });
    if (conversationId) return conversationId;

    // Fetch recipient details from Firestore
    const userDoc = await firestore().collection('users').doc(otherUid).get();
    let recipientName = 'Unknown';
    let recipientPhoto: string | null = null;
    if (userDoc.exists) {
      const userData = userDoc.data();
      // Use displayName if available, otherwise email
      recipientName = userData?.displayName || userData?.email || 'Unknown';
      recipientPhoto = userData?.photoURL || null;
    }

    // Create a new conversation document with unreadCounts initialized to 0 for both.
    const convRef = await firestore()
      .collection('conversations')
      .add({
        participants: [uid, otherUid],
        lastMessage: '',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        recipientName,
        recipientPhoto,
        unreadCounts: {[uid]: 0, [otherUid]: 0},
      });
    return convRef.id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Thunk to send a message and update unreadCounts accordingly.
export const sendMessage = createAsyncThunk<
  void,
  {conversationId: string; senderId: string; text: string},
  {rejectValue: string}
>(
  'chat/sendMessage',
  async ({conversationId, senderId, text}, {rejectWithValue}) => {
    try {
      const docRef = firestore()
        .collection('conversations')
        .doc(conversationId);

      // Add a new message to the "messages" subcollection.
      await docRef.collection('messages').add({
        senderId,
        text: text.trim(),
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // Retrieve current conversation data.
      const convSnap = await docRef.get();
      if (!convSnap.exists) throw new Error('Conversation does not exist');
      const convData = convSnap.data() || {};
      const participants: string[] = convData.participants || [];
      const existingUnread: Record<string, number> =
        convData.unreadCounts || {};

      // Build new unread counts: the sender’s count remains 0; for every other participant, increment by 1.
      const newUnreadCounts: Record<string, number> = {...existingUnread};
      participants.forEach(uid => {
        if (uid === senderId) {
          newUnreadCounts[uid] = 0;
        } else {
          newUnreadCounts[uid] = (newUnreadCounts[uid] || 0) + 1;
        }
      });

      // Update the conversation document with the new lastMessage, updatedAt, and unreadCounts.
      await docRef.update({
        lastMessage: text.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        unreadCounts: newUnreadCounts,
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      return rejectWithValue(error.message);
    }
  },
);

// Thunk to delete a conversation.
export const deleteConversation = createAsyncThunk<
  void,
  {conversationId: string},
  {rejectValue: string}
>('chat/deleteConversation', async ({conversationId}, {rejectWithValue}) => {
  try {
    const convRef = firestore().collection('conversations').doc(conversationId);
    const messagesSnap = await convRef.collection('messages').get();
    const batch = firestore().batch();
    messagesSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    batch.delete(convRef);
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
