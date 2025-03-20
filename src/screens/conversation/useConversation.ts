// src/screens/conversation/groupMessagesByDay.ts
import {Message} from '../../store/slices/chatSlice'; // adjust path if needed

type MessageSection = {
  title: string; // e.g. "Today", "Yesterday", or "Mar 21, 2023"
  data: Message[]; // messages for that day
};

function getMessageTime(timestamp: any): number {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().getTime();
  } else if (timestamp) {
    return new Date(timestamp).getTime();
  }
  // If timestamp is missing, assume it's "now"
  return Date.now();
}

export function groupMessagesByDay(messages: Message[]): MessageSection[] {
  // 1) Sort messages by timestamp ascending, using current time if missing
  const sorted = [...messages].sort((a, b) => {
    return getMessageTime(a.timestamp) - getMessageTime(b.timestamp);
  });

  // 2) Group messages by day using toDateString()
  const map: Record<string, Message[]> = {};
  for (const msg of sorted) {
    const time = getMessageTime(msg.timestamp);
    const key = new Date(time).toDateString();
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(msg);
  }

  // 3) Convert map to sections and apply labels ("Today", "Yesterday", or formatted date)
  const sections: MessageSection[] = Object.keys(map)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map(dayString => {
      const date = new Date(dayString);
      return {
        title: getDayLabel(date),
        data: map[dayString],
      };
    });

  return sections;
}

function getDayLabel(date: Date): string {
  const now = new Date();

  if (isSameDay(date, now)) {
    return 'Today';
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
