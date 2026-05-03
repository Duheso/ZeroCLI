// Stubs for optional/missing npm packages (ant-internal or unused)

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '@ant/claude-for-chrome-mcp' {
  export const BROWSER_TOOLS: string[];
  export type Logger = { info(msg: string): void; error(msg: string): void; };
  export type PermissionMode = 'always' | 'ask' | 'never';
  export class ClaudeForChromeContext {}
  export function createClaudeForChromeMcpServer(ctx?: any): any;
}

declare module 'ws' {
  class WebSocket {
    constructor(url: string, options?: Record<string, unknown>);
    constructor(url: string, protocols: string[], options?: Record<string, unknown>);
    on(event: string, callback: (...args: any[]) => void): void;
    send(data: any): void;
    close(): void;
    readonly readyState: number;
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSING: number;
    static readonly CLOSED: number;
  }
  export default WebSocket;
}

declare module '@ant/computer-use-mcp' {
  export type Cursor = { x: number; y: number };
  export type DisplayGeometry = { width: number; height: number };
  export type FrontmostApp = { name: string };
  export type RunningApp = { name: string };
  export type InstalledApp = { name: string };
  export type ScreenshotResult = { image: Buffer };
  export type ResolvePrepareCaptureResult = { action: string };
  export type BROWSER_TOOLS = string[];
  export class ComputerExecutor {}
  export function buildComputerUseTools(): any[];
}

declare module '@anthropic-ai/mcpb' {
  export type McpbUserConfigurationOption = {
    title?: string;
    type?: string;
    required?: boolean;
    multiple?: boolean;
    sensitive?: boolean;
    min?: number | null;
    max?: number | null;
    [key: string]: unknown;
  };
  export type McpbManifest = {
    name: string;
    version: string;
    author: { name: string; [key: string]: unknown };
    server?: unknown;
    user_config?: Record<string, McpbUserConfigurationOption>;
    [key: string]: unknown;
  };
  export function getMcpConfigForManifest(args: {
    manifest: McpbManifest;
    extensionPath: string;
    systemDirs: { dataDir: string; cacheDir: string; configDir: string };
    userConfig?: Record<string, unknown>;
    pathSeparator: string;
  }): Promise<unknown>;
  export const McpbManifestSchema: {
    safeParse(input: unknown): { success: boolean; data: McpbManifest; error: { flatten: () => { formErrors: unknown[] } } };
  };
}

declare module 'asciichart' {
  export function plot(series: number[], config?: Record<string, unknown>): string;
  const asciichart: { plot: typeof plot };
  export default asciichart;
}

declare module 'audio-capture-napi' {
  export class Logger {}
  export function isNativeAudioAvailable(): boolean
  export function isNativeRecordingActive(): boolean
  export function stopNativeRecording(): void
  export function startNativeRecording(
    onData: (data: Buffer) => void,
    onEnd: () => void,
  ): boolean
}

declare module 'plist' {
  export function parse(xml: string): Record<string, any>;
  export function build(obj: Record<string, any>, indent?: string): string;
  const _default: { parse: typeof parse; build: typeof build };
  export default _default;
}

declare module 'react-reconciler/constants.js' {
  export const LegacyRoot: number;
  export const ConcurrentRoot: number;
}
