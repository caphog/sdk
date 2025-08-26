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
    // Use userAgentData if available, fallback to userAgent and platform
    const userAgentData = (navigator as any).userAgentData;
    let operatingSystem: string | null = null;
    let browser: string | null = null;

    // OS detection
    if (userAgentData && userAgentData.platform) {
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
      } else {
        operatingSystem = platform;
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
      } else {
        operatingSystem = platform;
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
    if ((navigator as any).userAgentData && Array.isArray((navigator as any).userAgentData.brands)) {
      const brands = (navigator as any).userAgentData.brands;
      // brands is an array of {brand, version}
      // Try to find a known browser
      for (const b of brands) {
        const brand = b.brand.toLowerCase();
        if (brand.includes('edge')) {
          browser = 'edge';
          break;
        } else if (brand.includes('chrome')) {
          browser = 'chrome';
          break;
        } else if (brand.includes('safari')) {
          browser = 'safari';
          break;
        } else if (brand.includes('firefox')) {
          browser = 'firefox';
          break;
        } else if (brand.includes('opera')) {
          browser = 'opera';
          break;
        }
      }
      if (!browser && brands.length > 0) {
        browser = brands[0].brand.toLowerCase();
      }
    } else {
      // fallback to userAgent
      const userAgent = navigator.userAgent.toLowerCase();
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
    }

    return {
      operatingSystem,
      browser
    };
  }
}
