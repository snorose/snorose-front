import { GrowthBook } from '@growthbook/growthbook';
import { autoAttributesPlugin } from '@growthbook/growthbook/plugins';

export const growthbook = new GrowthBook({
  apiHost: 'https://cdn.growthbook.io',
  clientKey: import.meta.env.VITE_GROWTH_BOOK_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    // This is where you would send an event to your analytics provider
    console.log('Viewed Experiment', {
      experimentId: experiment.key,
      variationId: result.key,
    });
  },
  plugins: [autoAttributesPlugin()],
});
