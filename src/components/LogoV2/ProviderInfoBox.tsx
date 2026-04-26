import * as React from 'react'
import { Box, Text } from '../../ink.js'
import { buildProviderInfoLines } from '../StartupScreen.js'

/** Renders the tagline + provider info box inside Ink, below the ShimmerLogo. */
export function ProviderInfoBox() {
  const lines = buildProviderInfoLines()
  const [tagline, ...rest] = lines
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}><Text>{tagline}</Text></Box>
      {rest.map((line, i) => <Text key={i}>{line}</Text>)}
    </Box>
  )
}
