import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export const timeAgo = (
  timestamp: FirebaseFirestoreTypes.Timestamp | Date | number | undefined,
): string => {
  if (!timestamp) return '';
  const date =
    timestamp instanceof FirebaseFirestoreTypes.Timestamp
      ? timestamp.toDate()
      : timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export const formatTime = (
  timestamp: FirebaseFirestoreTypes.Timestamp | Date | number | undefined,
): string => {
  const date =
    timestamp instanceof FirebaseFirestoreTypes.Timestamp
      ? timestamp.toDate()
      : timestamp instanceof Date
      ? timestamp
      : new Date(timestamp ?? Date.now());
  return date
    .toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
};
