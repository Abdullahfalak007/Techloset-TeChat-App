import {ICONS} from '../constants/icons';

/**
 * Returns the final photo URL for a user.
 * Priority is given to the Firestore-stored photoURL;
 * if that is absent then the Firebase Auth photoURL is used;
 * otherwise, the default avatar is returned.
 *
 *  authPhotoURL - The photoURL from Firebase Auth.
 *  firestorePhotoURL - The photoURL from Firestore.
 *  The final image source URL.
 */
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
