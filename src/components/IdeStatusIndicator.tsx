import { basename } from 'path';
import * as React from 'react';
import { useIdeConnectionStatus } from '../hooks/useIdeConnectionStatus.js';
import type { IDESelection } from '../hooks/useIdeSelection.js';
import { Text } from '../ink.js';
import type { MCPServerConnection } from '../services/mcp/types.js';
import { t } from '../i18n/index.js';
import { getContextWindowForModel } from '../utils/context.js';
import { formatTokens } from '../utils/format.js';

type IdeStatusIndicatorProps = {
  ideSelection: IDESelection | undefined;
  mcpClients?: MCPServerConnection[];
  tokenUsage?: number;
  mainLoopModel?: string;
};

function formatTokenInfo(tokenUsage: number, model: string): string {
  const contextWindow = getContextWindowForModel(model);
  const pct = contextWindow > 0 ? Math.round((tokenUsage / contextWindow) * 100) : 0;
  return `${formatTokens(tokenUsage)}/${formatTokens(contextWindow)} tokens (${pct}%)`;
}

export function IdeStatusIndicator({
  ideSelection,
  mcpClients,
  tokenUsage,
  mainLoopModel,
}: IdeStatusIndicatorProps) {
  const { status: ideStatus } = useIdeConnectionStatus(mcpClients);
  const shouldShowIdeSelection =
    ideStatus === 'connected' &&
    (ideSelection?.filePath || (ideSelection?.text && ideSelection.lineCount > 0));

  const tokenSuffix =
    tokenUsage !== undefined && mainLoopModel
      ? ` · ${mainLoopModel} · ${formatTokenInfo(tokenUsage, mainLoopModel)}`
      : '';

  if (!shouldShowIdeSelection || !ideSelection) {
    if (!tokenSuffix) return null;
    return (
      <Text color="ide" key="token-indicator" wrap="truncate">
        {mainLoopModel} · {tokenUsage !== undefined && mainLoopModel ? formatTokenInfo(tokenUsage, mainLoopModel) : ''}
      </Text>
    );
  }

  if (ideSelection.text && ideSelection.lineCount > 0) {
    const lineLabel = ideSelection.lineCount === 1 ? t('ideLineSingular') : t('ideLinePlural');
    return (
      <Text color="ide" key="selection-indicator" wrap="truncate">
        ⧉ {ideSelection.lineCount} {lineLabel} {t('ideSelected')}{tokenSuffix}
      </Text>
    );
  }

  if (ideSelection.filePath) {
    const filename = basename(ideSelection.filePath);
    return (
      <Text color="ide" key="selection-indicator" wrap="truncate">
        ⧉ {t('ideInFile')} {filename}{tokenSuffix}
      </Text>
    );
  }
}
