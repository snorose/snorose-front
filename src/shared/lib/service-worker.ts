import * as Sentry from '@sentry/react';

export async function registerServiceWorker(
  scriptUrl: string | URL,
  option?: RegistrationOptions
): Promise<ServiceWorkerRegistration> {
  try {
    return await navigator.serviceWorker.register(scriptUrl, option);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        operation: 'service_worker.register',
      },
      extra: {
        scriptUrl: String(scriptUrl),
        requestedScope: option?.scope,
        workerType: option?.type ?? 'classic',
        isSecureContext: window.isSecureContext,
        online: navigator.onLine,
      },
    });

    throw error;
  }
}

export async function getRegistration(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.ready;
}

export async function getActiveRegistration(
  scriptUrl: string | URL
): Promise<ServiceWorkerRegistration | undefined> {
  const scriptURL = new URL(scriptUrl, window.location.origin).href;

  const registrations = await navigator.serviceWorker.getRegistrations();

  return registrations.find(
    (registration) =>
      registration.active?.scriptURL === scriptURL &&
      registration.active.state === 'activated'
  );
}

export function waitUntilActive(
  registration: ServiceWorkerRegistration,
  timeoutMs: number = 10_000
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (registration.active) {
      return resolve();
    }

    const worker = registration.installing ?? registration.waiting;

    if (!worker) {
      return reject(new Error('Service Worker가 존재하지 않습니다.'));
    }

    const handleStateChange = () => {
      if (worker.state === 'activated') {
        cleanup();
        resolve();
      }
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      worker.removeEventListener('statechange', handleStateChange);
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('서비스 워커 활성화 타임아웃'));
    }, timeoutMs);

    worker.addEventListener('statechange', handleStateChange);
  });
}
