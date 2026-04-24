import { c as _c } from "react-compiler-runtime";
import { Text } from '../ink.js';
import { t } from '../i18n/index.js';
export function PressEnterToContinue() {
  return <Text color="permission">{t('pressEnterToContinue')} <Text bold={true}>{t('pressEnterBold')}</Text> {t('pressEnterSuffix')}</Text>;
}
