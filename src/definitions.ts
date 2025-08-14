export interface CapHogPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
