import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBam9vY2mIwpbtS4g1S_ZNsIWCWNkZ2rQQ",
  authDomain: "badminton-booking-62d83.firebaseapp.com",
  projectId: "badminton-booking-62d83",
  storageBucket: "badminton-booking-62d83.appspot.com",
  messagingSenderId: "647687362154",
  appId: "1:647687362154:web:f59c91e8dc37678c551c13",
  measurementId: "G-M1GD665ZWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
