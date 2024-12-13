import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Make sure auth is imported
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBa7Wv6fqF0r2c2-deq1p9z9YX_XUC-HpI",
  authDomain: "enlighten-69649.firebaseapp.com",
  databaseURL: "https://enlighten-69649-default-rtdb.firebaseio.com",
  projectId: "enlighten-69649",
  storageBucket: "enlighten-69649.appspot.com",
  messagingSenderId: "799991390981",
  appId: "1:799991390981:web:31236f7dafb08004008d6c"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();
export { db, firebase };
