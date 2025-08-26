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
    const userAgentData = (navigator as any).userAgentData;
    let operatingSystem: string | null = null;
    let browser: string | null = null;

    // OS detection
    if (userAgentData?.platform) {
      const platform = userAgentData.platform.toLowerCase();
      if (platform.includes('win')) {
        operatingSystem = 'windows';
      } else if (platform.includes('mac')) {
        operatingSystem = 'macos';
      } else if (platform.includes('linux')) {
        operatingSystem = 'linux';
      } else if (platform.includes('android')) {
        operatingSystem = 'android';
      } else if (platform.includes('ios')) {
        operatingSystem = 'ios';
      }
    // navigator.platform is deprecated, but used here as a fallback for older browsers that do not support userAgentData.
    } else if (navigator.platform) {
      const platform = navigator.platform.toLowerCase();
      if (platform.includes('win')) {
        operatingSystem = 'windows';
      } else if (platform.includes('mac')) {
        operatingSystem = 'macos';
      } else if (platform.includes('linux')) {
        operatingSystem = 'linux';
      } else if (platform.includes('android')) {
        operatingSystem = 'android';
      } else if (platform.includes('iphone') || platform.includes('ipad') || platform.includes('ipod')) {
        operatingSystem = 'ios';
      }
    } else {
      // fallback to userAgent
      const userAgent = navigator.userAgent.toLowerCase();
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
    }

    // Browser detection
    if (userAgentData && Array.isArray(userAgentData.brands)) {
      const brands: {brand: string}[] = userAgentData.brands;
      for (const b of brands) {
        const brand = b.brand.toLowerCase();
        if (brand.includes('edge')) {
          browser = 'edge';
        } else if (brand.includes('chrome')) {
          browser = 'chrome';
        } else if (brand.includes('safari')) {
          browser = 'safari';
        } else if (brand.includes('firefox')) {
          browser = 'firefox';
        } else if (brand.includes('opera')) {
          browser = 'opera';
        }
      }
    } else {
      // fallback to userAgent
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('edg/') || userAgent.includes('edge')) {
        browser = 'edge';
      } else if (userAgent.includes('chrome') && !userAgent.includes('edg/') && !userAgent.includes('edge')) {
        browser = 'chrome';
      } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        browser = 'safari';
      } else if (userAgent.includes('firefox')) {
        browser = 'firefox';
      } else if (userAgent.includes('opr/') || userAgent.includes('opera')) {
        browser = 'opera';
      }
    }

    return {
      operatingSystem,
      browser
    };
  }
}
