import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase.config';

const firebaseClientApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseClientApp);

const store = getFirestore(firebaseClientApp);

export { firebaseClientApp, auth, store };
