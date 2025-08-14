import { registerPlugin } from '@capacitor/core';

import type { CapHogPlugin } from './definitions';

const CapHog = registerPlugin<CapHogPlugin>('CapHog', {
  web: () => import('./web').then((m) => new m.CapHogWeb()),
});

export * from './definitions';
export { CapHog };
