import { c as _c } from "react-compiler-runtime";
import { Text } from '../ink.js';
import { t } from '../i18n/index.js';
export function InterruptedByUser() {
  return <><Text dimColor={true}>{t('interrupted')} </Text>{false ? <Text dimColor={true}>· [internal] /issue to report a model issue</Text> : <Text dimColor={true}>· {t('whatShouldClaudoDoInstead')}</Text>}</>;
}
