// src/constants/appConstants.ts

import {ICONS} from './icons'; // or wherever your icons are located

export const DEFAULT_USER_NAME = 'Nazrul Islam';
export const DEFAULT_USER_STATUS = 'Never give up 💪';

// Example menu items for the Settings screen
export const SETTINGS_MENU_ITEMS = [
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Messages, group and others',
    icon: ICONS.notification, // Replace with your actual icon
  },
  {
    id: 'help',
    title: 'Help',
    subtitle: 'Help center, contact us, privacy policy',
    icon: ICONS.help, // Replace with your actual icon
  },
  {
    id: 'changePassword',
    title: 'Change Password',
    subtitle: 'Change Account Password',
    icon: ICONS.changePassword, // Replace with your actual icon
  },
  {
    id: 'inviteFriend',
    title: 'Invite a friend',
    subtitle: 'Share with your friends',
    icon: ICONS.invite, // Replace with your actual icon
  },
];
