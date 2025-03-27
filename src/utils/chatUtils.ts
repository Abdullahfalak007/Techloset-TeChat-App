// src/utils/chatUtils.ts
import {Message, MessageSection} from '../constants/types';
export function groupMessagesByDay(messages: Message[]): MessageSection[] {
  // Group messages by their date (using toDateString to ignore time)
  const groups: {[key: string]: Message[]} = {};
  messages.forEach(message => {
    const date =
      message.timestamp && typeof message.timestamp.toDate === 'function'
        ? message.timestamp.toDate()
        : new Date(message.timestamp);
    const dateKey = date.toDateString(); // e.g. "Mon Mar 25 2025"
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  // Create Date objects for today and yesterday.
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Sort keys (which are date strings) in ascending order.
  const sortedKeys = Object.keys(groups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  // Map each date key to a section with a formatted title.
  const sections: MessageSection[] = sortedKeys.map(key => {
    const dateObj = new Date(key);
    let title: string;
    if (dateObj.toDateString() === today.toDateString()) {
      title = 'Today';
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      title = 'Yesterday';
    } else {
      // Use locale date string (you can adjust format as needed)
      title = dateObj.toLocaleDateString();
    }
    return {title, data: groups[key]};
  });

  return sections;
}
