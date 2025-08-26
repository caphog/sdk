import { WebPlugin } from '@capacitor/core';

import type { CapHogPlugin } from './definitions';

export class CapHogWeb extends WebPlugin implements CapHogPlugin {
  private projectId: string | null = null;

  async initialize(config: { projectId: string }): Promise<void> {
    this.projectId = config.projectId;
  }

  async logEvent(data: { eventName: string, payload?: Record<string, any> }): Promise<void> {
    if (!this.projectId) {
      throw new Error('CapHog not initialized. Call initialize() with projectId first.');
    }

    const response = await fetch(`https://caphog.com/api/v1/event-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: data.eventName,
        projectId: this.projectId,
        timestamp: Date.now(),
        platform: 'web',
        device: this.getDeviceData(),
        customPayload: data.payload,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  private getDeviceData(): {
    operatingSystem: string | null;
    browser: string | null;
  } {
    const userAgent = navigator.userAgent.toLowerCase();
    let operatingSystem: string | null = null;
    if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
      operatingSystem = 'ios';
    } else if (userAgent.includes('android')) {
      operatingSystem = 'android';
    } else if (userAgent.includes('windows')) {
      operatingSystem = 'windows';
    } else if (userAgent.includes('mac')) {
      operatingSystem = 'macos';
    } else if (userAgent.includes('linux')) {
      operatingSystem = 'linux';
    }

    // Detect browser type and version
    let browser: string | null = null;
    if (userAgent.includes('edg/')) {
      browser = 'edge';
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg/')) {
      browser = 'chrome';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browser = 'safari';
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox';
    } else if (userAgent.includes('opr/') || userAgent.includes('opera')) {
      browser = 'opera';
    }

    return {
      operatingSystem,
      browser
    };
  }
}
