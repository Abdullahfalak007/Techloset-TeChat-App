import {ICONS} from './icons';
export const DEFAULT_USER_NAME = 'No Username';
export const DEFAULT_USER_STATUS = 'No Status Added Yet';

export const SETTINGS_MENU_ITEMS = [
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Messages, group and others',
    icon: ICONS.notification,
  },
  {
    id: 'help',
    title: 'Help',
    subtitle: 'Help center, contact us, privacy policy',
    icon: ICONS.help,
  },
  {
    id: 'changePassword',
    title: 'Change Password',
    subtitle: 'Change Account Password',
    icon: ICONS.changePassword,
  },
  {
    id: 'inviteFriend',
    title: 'Invite a friend',
    subtitle: 'Share with your friends',
    icon: ICONS.invite,
  },
];
