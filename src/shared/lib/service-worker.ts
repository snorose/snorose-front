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
