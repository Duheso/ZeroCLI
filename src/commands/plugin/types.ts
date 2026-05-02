/**
 * View state for the plugin settings screen.
 */
export type ViewState =
  // Object forms
  | { type: 'menu' }
  | { type: 'validate'; path: string }
  | { type: 'discover-plugins' }
  | { type: 'browse-marketplace'; targetMarketplace: string; targetPlugin?: string }
  | { type: 'manage-plugins'; targetPlugin?: string; targetMarketplace?: string; action?: 'uninstall' | 'enable' | 'disable' | 'disable-all' }
  | { type: 'manage-marketplaces'; targetMarketplace?: string; action?: 'remove' | 'update' }
  | { type: 'add-marketplace'; initialValue?: string }
  | { type: 'configure-marketplace'; name?: string }
  | { type: 'plugin-menu'; plugin: { name: string; marketplace: string } }
  | { type: 'configure-plugin'; pluginId: string; plugin: { name: string } }
  | { type: 'configuring-options'; schema: unknown; pluginId?: string; plugin?: { name: string } }
  | { type: 'mcp-manifest'; serverName: string }
  | { type: 'mcp-tools'; client: { name: string } }
  | { type: 'mcp-detail'; client: unknown }
  | { type: 'mcp-tool-detail'; client: unknown; tool: unknown }
  | { type: 'edit-mcp-config'; client: { name: string } }
  | { type: 'failed-plugin-details'; plugin: { id: string; name: string; marketplace: string; errors: unknown[]; scope: string; error?: unknown } }
  | { type: 'flagged-detail'; plugin: { id: string; name: string; marketplace: string; reason: string; text: string; flaggedAt: string } }
  | { type: 'plugin-options'; plugin?: unknown; pluginId?: string }
  | { type: 'confirm-data-cleanup'; size?: number }
  // String literals used internally by ManagePlugins / BrowseMarketplace
  | 'help'
  | 'installed-plugins'
  | 'installed-marketplaces'
  | 'marketplace-list'
  | 'plugin-list'
  | 'configuring'
  | 'back-to-marketplace'
  | 'plugin-details'
  | 'plugin-details-menu'
  | 'flagged-plugins'
  | 'validating'
  | 'confirm-project-uninstall'

/**
 * Props for the PluginSettings component.
 */
export type PluginSettingsProps = {
  parsedCommand: { type: string };
};
