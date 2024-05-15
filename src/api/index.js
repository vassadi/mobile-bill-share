import { store } from '../config/getClientConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const isUserAvailable = async (phoneNumber) => {
  const usersRef = collection(store, 'users');

  const snap = query(usersRef, where('number', '==', phoneNumber));
  const docs = await getDocs(snap);

  return docs.empty;
};
