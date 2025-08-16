export interface CapHogPlugin {
  initialize(config: { projectId: string }): Promise<void>;

  logEvent(data: { eventName: string, payload?: Record<string, any> }): Promise<void>;
}
