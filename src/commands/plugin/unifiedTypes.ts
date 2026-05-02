import type { MCPServerConnection } from '../../services/mcp/types.js';

/**
 * Unified item representing a plugin, MCP server, theme, or failed/flagged plugin
 * in the unified installed list view.
 */
export type UnifiedInstalledItem =
  | UnifiedPluginItem
  | UnifiedMcpItem
  | UnifiedThemeItem
  | UnifiedFailedPluginItem
  | UnifiedFlaggedPluginItem;

export type UnifiedPluginItem = {
  type: 'plugin';
  id?: string;
  name?: string;
  description?: string;
  plugin: { name: string; description?: string };
  version?: string;
  marketplace?: string;
  scope?: string;
  isGlobal?: boolean;
  isEnabled?: boolean;
  errors?: unknown[];
  pendingEnable?: string | boolean | null | undefined;
  pendingUpdate?: string | boolean | null | undefined;
  pendingToggle?: 'will-enable' | 'will-disable' | null;
  errorCount?: number;
  hasUpdates?: boolean;
};

export type UnifiedMcpItem = {
  type: 'mcp';
  id?: string;
  name?: string;
  description?: string;
  pluginId?: string;
  scope: string;
  status?: string;
  client?: MCPServerConnection;
  isGlobal?: boolean;
  isEnabled?: boolean;
  pendingToggle?: 'will-enable' | 'will-disable' | null;
  errorCount?: number;
  hasUpdates?: boolean;
  toolCount?: number;
  transport?: string;
  isAuthenticated?: boolean | undefined;
  indented?: boolean;
};

export type UnifiedThemeItem = {
  type: 'theme';
  name?: string;
  pluginId?: string;
  isGlobal?: boolean;
  isEnabled?: boolean;
  pendingToggle?: 'will-enable' | 'will-disable' | null;
  errorCount?: number;
  hasUpdates?: boolean;
};

export type UnifiedFailedPluginItem = {
  type: 'failed-plugin';
  id: string;
  name: string;
  marketplace: string;
  scope: string;
  errorCount: number;
  errors: unknown[];
};

export type UnifiedFlaggedPluginItem = {
  type: 'flagged-plugin';
  id: string;
  name: string;
  marketplace: string;
  reason: string;
  text: string;
  flaggedAt: string;
  scope: string;
};
