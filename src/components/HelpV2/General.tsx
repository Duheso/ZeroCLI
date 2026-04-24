import { c as _c } from "react-compiler-runtime";
import { Box, Text } from '../../ink.js';
import { PromptInputHelpMenu } from '../PromptInput/PromptInputHelpMenu.js';
import { t } from '../../i18n/index.js';
export function General() {
  return (
    <Box flexDirection="column" paddingY={1} gap={1}>
      <Box><Text>{t('claudeUnderstandsCodebase')}</Text></Box>
      <Box flexDirection="column">
        <Box><Text bold={true}>{t('shortcuts')}</Text></Box>
        <PromptInputHelpMenu gap={2} fixedWidth={true} />
      </Box>
    </Box>
  );
}
