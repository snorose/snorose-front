import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);

let messaging = null;
const isFcmSupported = await isSupported();

if (isFcmSupported) {
  messaging = getMessaging(firebaseApp);
} else {
  console.warn('이 브라우저에서 Firebase Messaging을 지원하지 않습니다.');
}

export { messaging };
