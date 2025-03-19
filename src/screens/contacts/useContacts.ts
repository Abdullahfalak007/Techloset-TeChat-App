// src>screens>contacts>useContacts.ts
import {Contact} from './Contacts'; // or define the interface inline

export function groupContactsByInitial(contacts: Contact[]) {
  // 1) Sort the contacts
  const sorted = [...contacts].sort((a, b) => {
    const nameA = (a.displayName || a.email).toLowerCase();
    const nameB = (b.displayName || b.email).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // 2) Group them by first letter
  const map: Record<string, Contact[]> = {};
  for (const contact of sorted) {
    const name = contact.displayName || contact.email;
    const firstLetter = name.charAt(0).toUpperCase();
    if (!map[firstLetter]) {
      map[firstLetter] = [];
    }
    map[firstLetter].push(contact);
  }

  // 3) Convert map to an array of sections
  return Object.keys(map)
    .sort()
    .map(letter => ({
      title: letter,
      data: map[letter],
    }));
}
