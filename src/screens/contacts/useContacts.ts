// // src/screens/contacts/useContacts.ts
// import {useEffect, useState} from 'react';
// import firestore from '@react-native-firebase/firestore';
// import {useAppSelector} from '../../hooks/useStore';

// interface ContactItem {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   base64Photo: string | null;
// }

// export const useContacts = () => {
//   const {user} = useAppSelector(state => state.auth);
//   const [contacts, setContacts] = useState<ContactItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('users')
//       .onSnapshot(
//         snapshot => {
//           const list: ContactItem[] = [];
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             if (data.uid !== user?.uid) {
//               list.push({
//                 uid: data.uid,
//                 email: data.email,
//                 displayName: data.displayName || null,
//                 photoURL: data.photoURL || null,
//                 base64Photo: data.base64Photo || null,
//               });
//             }
//           });
//           setContacts(list);
//           setLoading(false);
//         },
//         error => {
//           console.error('Error fetching contacts:', error);
//           setLoading(false);
//         },
//       );

//     return () => unsubscribe();
//   }, [user?.uid]);

//   return {contacts, loading};
// };
