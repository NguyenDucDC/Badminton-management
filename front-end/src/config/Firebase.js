import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
const firebaseConfig = {
  apiKey: 'AIzaSyADBB-OINoXX_6P4QNzryrCaW7Ocq1Ru-g',
  authDomain: 'fun-chat-bb808.firebaseapp.com',
  projectId: 'fun-chat-bb808',
  storageBucket: 'fun-chat-bb808.appspot.com',
  messagingSenderId: '1024552174015',
  appId: '1:1024552174015:web:a69ada0bd9032b68c3a10a',
  measurementId: 'G-0XZZZGB7N8',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const storage = firebase.storage()
export const db = firebase.firestore()
