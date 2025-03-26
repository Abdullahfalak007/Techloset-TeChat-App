// src/store/slices/chatSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import {ChatState, Conversation} from '../../constants/types';

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

export const sendMessage = createAsyncThunk<
  void,
  {
    conversationId: string;
    senderId: string;
    text: string;
    type?: 'text' | 'image';
  },
  {rejectValue: string}
>(
  'chat/sendMessage',
  async (
    {conversationId, senderId, text, type = 'text'},
    {rejectWithValue},
  ) => {
    try {
      const docRef = firestore()
        .collection('conversations')
        .doc(conversationId);

      // Only trim text if the message type is 'text'
      const messageText = type === 'text' ? text.trim() : text;

      // Log the length to verify that the image base64 is complete
      if (type === 'image') {
        console.log(
          'Sending image message, base64 length:',
          messageText.length,
        );
      }

      await docRef.collection('messages').add({
        senderId,
        text: messageText,
        type,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // Retrieve current conversation data.
      const convSnap = await docRef.get();
      if (!convSnap.exists) throw new Error('Conversation does not exist');
      const convData = convSnap.data() || {};
      const participants: string[] = convData.participants || [];
      const existingUnread: Record<string, number> =
        convData.unreadCounts || {};

      const newUnreadCounts: Record<string, number> = {...existingUnread};
      participants.forEach(uid => {
        if (uid === senderId) {
          newUnreadCounts[uid] = 0;
        } else {
          newUnreadCounts[uid] = (newUnreadCounts[uid] || 0) + 1;
        }
      });

      const lastMessage = type === 'image' ? 'Photo' : messageText;
      await docRef.update({
        lastMessage,
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
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, state => {
        // Optionally, you might remove the conversation from state here,
        // but Firestore's onSnapshot listener should update it.
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete conversation';
      });
  },
});

export const {clearChatState, setConversations} = chatSlice.actions;
export default chatSlice.reducer;
