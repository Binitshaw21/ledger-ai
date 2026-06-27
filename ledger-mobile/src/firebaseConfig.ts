import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAAJ91jBX9LNXSAEEBOxavFw4YHxNTgpwY",
  authDomain: "ledger-ai-1235a.firebaseapp.com",
  databaseURL: "https://ledger-ai-1235a-default-rtdb.firebaseio.com",
  projectId: "ledger-ai-1235a",
  storageBucket: "ledger-ai-1235a.firebasestorage.app",
  messagingSenderId: "187031514932",
  appId: "1:187031514932:web:13b5ae6c3ae12632efff61",
  measurementId: "G-1DWSKZS2TN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
