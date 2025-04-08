import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Message, MessageSection} from '../constants/types';

export function groupMessagesByDay(messages: Message[]): MessageSection[] {
  const groups: {[key: string]: Message[]} = {};
  messages.forEach(message => {
    const date =
      message.timestamp instanceof FirebaseFirestoreTypes.Timestamp
        ? message.timestamp.toDate()
        : new Date(message.timestamp);
    const dateKey = new Date(date).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sortedKeys = Object.keys(groups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const sections: MessageSection[] = sortedKeys.map(key => {
    const dateObj = new Date(key);
    let title: string;
    if (dateObj.toDateString() === today.toDateString()) {
      title = 'Today';
    } else if (dateObj.toDateString() === yesterday.toDateString()) {
      title = 'Yesterday';
    } else {
      title = dateObj.toLocaleDateString();
    }
    return {title, data: groups[key]};
  });

  return sections;
}
