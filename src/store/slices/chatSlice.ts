import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import {ChatState, Conversation} from '../../constants/types';
import {DocumentData} from '@firebase/firestore-types';

const initialState: ChatState = {
  loading: false,
  error: null,
  conversations: [],
};

export const createConversation = createAsyncThunk<
  string,
  {uid: string; otherUid: string},
  {rejectValue: string}
>('chat/createConversation', async ({uid, otherUid}, {rejectWithValue}) => {
  try {
    const snapshot = await firestore()
      .collection('conversations')
      .where('participants', 'array-contains', uid)
      .get();

    let conversationId: string | null = null;
    snapshot.forEach(doc => {
      const data = doc.data() as DocumentData;
      if (data.participants.includes(otherUid)) {
        conversationId = doc?.id;
      }
    });
    if (conversationId) return conversationId;

    const userDoc = await firestore().collection('users').doc(otherUid).get();
    let recipientName = 'Unknown';
    let recipientPhoto: string | null = null;
    if (userDoc.exists) {
      const userData = userDoc.data();
      recipientName = userData?.displayName || userData?.email || 'Unknown';
      recipientPhoto = userData?.photoURL || null;
    }

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
  } catch (error: unknown) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('An unknown error occurred');
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
      const messageText = type === 'text' ? text.trim() : text;
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
      const convSnap = await docRef.get();
      if (!convSnap.exists) throw new Error('Conversation does not exist');
      const convData = convSnap.data() || ({} as DocumentData);
      const participants: string[] = convData.participants || [];
      const existingUnread: Record<string, number> =
        convData.unreadCounts || {};
      const newUnreadCounts: Record<string, number> = {...existingUnread};
      participants.forEach((uid: string) => {
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
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('Failed to send message');
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
    const messagesSnap = await convRef.collection('messages').get();
    const batch = firestore().batch();
    messagesSnap.forEach(doc => {
      batch.delete(doc.ref);
    });
    batch.delete(convRef);
    await batch.commit();
  } catch (error: unknown) {
    console.error('Error deleting conversation:', error);
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('Failed to delete conversation');
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
      .addCase(deleteConversation.fulfilled, state => {})
      .addCase(deleteConversation.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete conversation';
      });
  },
});

export const {clearChatState, setConversations} = chatSlice.actions;
export default chatSlice.reducer;
