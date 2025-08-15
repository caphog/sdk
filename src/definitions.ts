export interface CapHogPlugin {
  init(config: { projectId: string }): Promise<void>;

  logEvent(eventName: string, payload: Record<string, any>): Promise<void>;
}
