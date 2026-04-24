import React from 'react'
import { Box, Link, Text } from '../ink.js'
import { Select } from './CustomSelect/index.js'
import { Dialog } from './design-system/Dialog.js'
import { getAPIProvider } from '../utils/model/providers.js'
import { t } from '../i18n/index.js'

type Props = {
  onDone: () => void
}

function getProviderLabel(): string {
  const provider = getAPIProvider()
  switch (provider) {
    case 'firstParty':
      return 'Anthropic API'
    case 'bedrock':
      return 'AWS Bedrock'
    case 'vertex':
      return 'Google Vertex'
    case 'foundry':
      return 'Azure Foundry'
    case 'openai':
      return 'OpenAI-compatible API'
    case 'gemini':
      return 'Gemini API'
    default:
      return 'API'
  }
}

export function CostThresholdDialog({ onDone }: Props): React.ReactNode {
  const providerLabel = getProviderLabel()
  const spentFn = t('spentOnProvider')
  return (
    <Dialog
      title={spentFn('$5', providerLabel)}
      onCancel={onDone}
    >
      <Box flexDirection="column">
        <Text>{t('learnMoreCosts')}</Text>
        <Link url="https://code.claude.com/docs/en/costs" />
      </Box>
      <Select
        options={[
          {
            value: 'ok',
            label: t('gotItThanks') as string,
          },
        ]}
        onChange={onDone}
      />
    </Dialog>
  )
}
