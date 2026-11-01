// 1. notificationclick을 Firebase보다 먼저 등록
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // const link = event.notification.data?.link ?? '/alert';

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(() => {
        return self.clients.openWindow('/alert');
      })
  );
});

// 2. Firebase 로드
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyC6bVJTwYpW-ffJ2j2HSY45FwXdXRA545k',
  projectId: 'snorose-c37c1',
  messagingSenderId: '120670270079',
  appId: '1:120670270079:web:e7ba0364bd1813ca73854a',
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  const { title, body, link } = payload.data ?? {};

  if (!title) {
    return;
  }

  return self.registration.showNotification(title, {
    body,
    icon: '/logos/snoroseLogo180.png',
    data: { link },
  });
});
