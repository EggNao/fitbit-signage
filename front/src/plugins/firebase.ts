import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDr3JUJS7VvcT6vGDwM-OWIjnz_ifgfiUE',
  authDomain: 'fitbit-signage.firebaseapp.com',
  projectId: 'fitbit-signage',
  storageBucket: 'fitbit-signage.appspot.com',
  messagingSenderId: '403216664034',
  appId: '1:403216664034:web:de2a757f63aa0f980465bb',
}
/** Firebase App */
export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth: Auth = getAuth(firebaseApp)
export const firestore: Firestore = getFirestore(firebaseApp)

/** firebase auth */
const googleAuthProvider = new GoogleAuthProvider()

/** PopUp */
export const googleSignIn = () => {
  signInWithPopup(firebaseAuth, googleAuthProvider)
}

/** ログアウト */
export const signOut = () => fbSignOut(firebaseAuth)
