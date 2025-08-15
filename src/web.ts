import { WebPlugin } from '@capacitor/core';

import type { CapHogPlugin } from './definitions';

export class CapHogWeb extends WebPlugin implements CapHogPlugin {
  private projectId: string | null = null;

  async init(config: { projectId: string }): Promise<void> {
    this.projectId = config.projectId;
  }

  async logEvent(eventName: string, payload: Record<string, any>): Promise<void> {
    if (!this.projectId) {
      throw new Error('CapHog not initialized. Call init() with projectId first.');
    }
    console.log(`Logging event: ${eventName}`, payload);
    const response = await fetch(`https://caphog.com/api/v1/event-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: eventName,
        projectId: this.projectId,
        customPayload: payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
