import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: 'AIzaSyAhelk_39kII2gWBtqYZvf0BLbpb6VLkaE',
  authDomain: "ckd-web-interface.firebaseapp.com",
  databaseURL: "https://ckd-web-interface-default-rtdb.firebaseio.com",
  projectId: "ckd-web-interface",
  storageBucket: "ckd-web-interface.appspot.com",
  messagingSenderId: "687103645306",
  appId: "1:687103645306:web:1fa72b87d583a3177fcdc3",
  measurementId: "G-WJDLYX202C"
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Get the auth instance
const database = getDatabase(firebaseApp); // Get the database instance
const firestore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp); 
const db = getFirestore(firebaseApp)
const storage = getStorage()
export const config = {storage}
export { auth, db,database, firestore, firebaseStorage, firebaseApp as default };
