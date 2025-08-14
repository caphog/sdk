import { WebPlugin } from '@capacitor/core';

import type { CapHogPlugin } from './definitions';

export class CapHogWeb extends WebPlugin implements CapHogPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
