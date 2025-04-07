import {ICONS} from '../constants/icons';

export function getFinalPhotoURL(
  authPhotoURL: string | null,
  firestorePhotoURL: string | null,
): string {
  if (firestorePhotoURL) {
    return firestorePhotoURL;
  }
  if (authPhotoURL) {
    return authPhotoURL;
  }
  return ICONS.avatar;
}
