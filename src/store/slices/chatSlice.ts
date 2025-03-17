// src/store/slices/chatSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {RootState} from '../store';

// Interfaces for conversation & messages
export interface Conversation {
  id: string;
  lastMessage?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
  // You can store listener references if needed for unsubscribing
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  loading: false,
  error: null,
};

// Listen to all user conversations from `/userConversations/{uid}`
export const listenToUserConversations = createAsyncThunk<
  void,
  {uid: string},
  {state: RootState}
>('chat/listenToUserConversations', async ({uid}, {dispatch}) => {
  // Setup a realtime listener for /userConversations/{uid}
  const userConvRef = database().ref(`/userConversations/${uid}`);

  userConvRef.on('value', async snapshot => {
    if (!snapshot.exists()) {
      dispatch(chatSlice.actions.setConversations([]));
      return;
    }
    const data = snapshot.val(); // e.g. { convId1: true, convId2: true }
    const convIds = Object.keys(data);

    // For each conversation ID, get the last message from /conversations/{convId}/messages
    const convArray: Conversation[] = [];
    for (const convId of convIds) {
      const messagesSnap = await database()
        .ref(`/conversations/${convId}/messages`)
        .orderByKey()
        .limitToLast(1)
        .once('value');

      let lastMessage = '';
      messagesSnap.forEach((msg: FirebaseDatabaseTypes.DataSnapshot) => {
        const msgData = msg.val();
        lastMessage = msgData?.text || '';
        return undefined;
      });
      convArray.push({id: convId, lastMessage});
    }

    dispatch(chatSlice.actions.setConversations(convArray));
  });
});

// Listen to messages of a specific conversation
export const listenToConversation = createAsyncThunk<
  void,
  {conversationId: string; userUid: string},
  {state: RootState}
>(
  'chat/listenToConversation',
  async ({conversationId, userUid}, {dispatch}) => {
    // set active conversation in Redux
    dispatch(chatSlice.actions.setActiveConversation(conversationId));

    const messagesRef = database().ref(
      `/conversations/${conversationId}/messages`,
    );

    messagesRef.on('value', snapshot => {
      if (!snapshot.exists()) {
        dispatch(chatSlice.actions.setMessages([]));
        return;
      }
      const data = snapshot.val(); // { msgId: { senderId, text, timestamp }, ... }
      const msgArray: Message[] = Object.keys(data).map(msgId => ({
        id: msgId,
        senderId: data[msgId].senderId,
        text: data[msgId].text,
        timestamp: data[msgId].timestamp,
      }));
      // sort by timestamp
      msgArray.sort((a, b) => a.timestamp - b.timestamp);

      dispatch(chatSlice.actions.setMessages(msgArray));
    });
  },
);

// Send a new message
export const sendMessage = createAsyncThunk<
  void,
  {conversationId: string; senderId: string; text: string},
  {state: RootState}
>('chat/sendMessage', async ({conversationId, senderId, text}) => {
  if (!text.trim()) return;

  const newMessageRef = database()
    .ref(`/conversations/${conversationId}/messages`)
    .push();
  await newMessageRef.set({
    senderId,
    text: text.trim(),
    timestamp: Date.now(),
  });
});

// Optionally, create a conversation with some user(s)
export const createConversation = createAsyncThunk<
  string, // returns the new conversationId
  {uid: string; otherUid: string},
  {state: RootState}
>('chat/createConversation', async ({uid, otherUid}) => {
  // create a new conversation ID
  const convRef = database().ref('/conversations').push();
  const conversationId = convRef.key as string;

  // Mark the conversation for both users
  await database().ref(`/userConversations/${uid}/${conversationId}`).set(true);
  await database()
    .ref(`/userConversations/${otherUid}/${conversationId}`)
    .set(true);

  return conversationId;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    clearChatState(state) {
      // e.g. sign out or cleanup
      state.conversations = [];
      state.messages = [];
      state.activeConversationId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(listenToUserConversations.pending, state => {
        state.loading = true;
      })
      .addCase(listenToUserConversations.fulfilled, state => {
        state.loading = false;
      })
      .addCase(listenToUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Error listening to conversations';
      })

      .addCase(listenToConversation.pending, state => {
        state.loading = true;
      })
      .addCase(listenToConversation.fulfilled, state => {
        state.loading = false;
      })
      .addCase(listenToConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error listening to conversation';
      })

      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send message';
      })

      .addCase(createConversation.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create conversation';
      });
  },
});

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
