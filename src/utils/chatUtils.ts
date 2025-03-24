// src/utils/chatUtils.ts
import {Message} from '../store/slices/chatSlice';

export const groupMessagesByDay = (messages: Message[]) => {
  const groups: {[key: string]: Message[]} = {};

  messages.forEach(message => {
    const date = message.timestamp?.toDate?.() || new Date(message.timestamp);
    const dateString = date.toDateString();
    groups[dateString] = [...(groups[dateString] || []), message];
  });

  return Object.keys(groups)
    .map(date => ({
      title: date,
      data: groups[date],
    }))
    .sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
};
