import { c as _c } from "react-compiler-runtime";
import React from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';
import { t } from '../../i18n/index.js';
const WELCOME_V2_WIDTH = 58;
export function WelcomeV2() {
  const $ = _c(38);
  const [theme] = useTheme();
  if (env.terminal === "Apple_Terminal") {
    let t0;
    if ($[0] !== theme) {
      t0 = <AppleTerminalWelcomeV2 theme={theme} welcomeMessage={t('welcomeToClaudeCode') as string} />;
      $[0] = theme;
      $[1] = t0;
    } else {
      t0 = $[1];
    }
    return t0;
  }
  if (["light", "light-daltonized", "light-ansi"].includes(theme)) {
    let t0;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
      t0 = <Text><Text color="claude">{t('welcomeToZeroCLI')} </Text><Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text></Text>;
      t1 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text>;
      t2 = <Text>{"                                                          "}</Text>;
      t3 = <Text>{"                                                          "}</Text>;
      t4 = <Text>{"                                                          "}</Text>;
      t5 = <Text>{"            \u2591\u2591\u2591\u2591\u2591\u2591                                        "}</Text>;
      t6 = <Text>{"    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                      "}</Text>;
      t7 = <Text>{"   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                    "}</Text>;
      t8 = <Text>{"                                                          "}</Text>;
      $[2] = t0;
      $[3] = t1;
      $[4] = t2;
      $[5] = t3;
      $[6] = t4;
      $[7] = t5;
      $[8] = t6;
      $[9] = t7;
      $[10] = t8;
    } else {
      t0 = $[2];
      t1 = $[3];
      t2 = $[4];
      t3 = $[5];
      t4 = $[6];
      t5 = $[7];
      t6 = $[8];
      t7 = $[9];
      t8 = $[10];
    }
    let t9;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
      t9 = <Text><Text dimColor={true}>{"                           \u2591\u2591\u2591\u2591"}</Text><Text>{"                     \u2588\u2588    "}</Text></Text>;
      $[11] = t9;
    } else {
      t9 = $[11];
    }
    let t10;
    let t11;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
      t10 = <Text><Text dimColor={true}>{"                         \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591"}</Text><Text>{"               \u2588\u2588\u2592\u2592\u2588\u2588  "}</Text></Text>;
      t11 = <Text>{"                                            \u2592\u2592      \u2588\u2588   \u2592"}</Text>;
      $[12] = t10;
      $[13] = t11;
    } else {
      t10 = $[12];
      t11 = $[13];
    }
    let t12;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = <Text>{"      "}<Text color="clawd_body">  ░░████░░  </Text>{"                         \u2592\u2592\u2591\u2591\u2592\u2592      \u2592 \u2592\u2592"}</Text>;
      $[14] = t12;
    } else {
      t12 = $[14];
    }
    let t13;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
      t13 = <Text>{"      "}<Text color="clawd_body" backgroundColor="clawd_background"> ░████████░</Text>{"                           \u2592\u2592         \u2592\u2592 "}</Text>;
      $[15] = t13;
    } else {
      t13 = $[15];
    }
    let t14;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
      t14 = <Text>{"      "}<Text color="clawd_body">░██░░██░░██░</Text>{"                         \u2591          \u2592   "}</Text>;
      $[16] = t14;
    } else {
      t14 = $[16];
    }
    let t15;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
      t15 = <Text>{"      "}<Text color="clawd_body">░██████████░</Text>{"                         "}</Text>;
      $[17] = t15;
    } else {
      t15 = $[17];
    }
    let t16;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
      t16 = <Text>{"      "}<Text color="clawd_body">░██████████░</Text>{"                         "}</Text>;
      $[18] = t16;
    } else {
      t16 = $[18];
    }
    let t17;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
      t17 = <Box width={WELCOME_V2_WIDTH}><Text>{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}{t16}<Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}<Text color="clawd_body">{"\u2588  \u2588  \u2588  \u2588"}</Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2591\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2592\u2026\u2026\u2026\u2026"}</Text></Text></Box>;
      $[19] = t17;
    } else {
      t17 = $[19];
    }
    return t17;
  }
  let t0;
  let t1;
  let t2;
  let t3;
  let t4;
  let t5;
  let t6;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Text><Text color="claude">{t('welcomeToZeroCLI')} </Text><Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text></Text>;
    t1 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text>;
    t2 = <Text>{"                                                          "}</Text>;
    t3 = <Text>{"     *                                       \u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2591     "}</Text>;
    t4 = <Text>{"                                 *         \u2588\u2588\u2588\u2593\u2591     \u2591\u2591   "}</Text>;
    t5 = <Text>{"            \u2591\u2591\u2591\u2591\u2591\u2591                        \u2588\u2588\u2588\u2593\u2591           "}</Text>;
    t6 = <Text>{"    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                      \u2588\u2588\u2588\u2593\u2591           "}</Text>;
    $[20] = t0;
    $[21] = t1;
    $[22] = t2;
    $[23] = t3;
    $[24] = t4;
    $[25] = t5;
    $[26] = t6;
  } else {
    t0 = $[20];
    t1 = $[21];
    t2 = $[22];
    t3 = $[23];
    t4 = $[24];
    t5 = $[25];
    t6 = $[26];
  }
  let t10;
  let t11;
  let t7;
  let t8;
  let t9;
  if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = <Text><Text>{"   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591    "}</Text><Text bold={true}>*</Text><Text>{"                \u2588\u2588\u2593\u2591\u2591      \u2593   "}</Text></Text>;
    t8 = <Text>{"                                             \u2591\u2593\u2593\u2588\u2588\u2588\u2593\u2593\u2591    "}</Text>;
    t9 = <Text dimColor={true}>{" *                                 \u2591\u2591\u2591\u2591                   "}</Text>;
    t10 = <Text dimColor={true}>{"                                 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                 "}</Text>;
    t11 = <Text dimColor={true}>{"                               \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591           "}</Text>;
    $[27] = t10;
    $[28] = t11;
    $[29] = t7;
    $[30] = t8;
    $[31] = t9;
  } else {
    t10 = $[27];
    t11 = $[28];
    t7 = $[29];
    t8 = $[30];
    t9 = $[31];
  }
  let t12;
  if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = <Text color="clawd_body">  ░░████░░  </Text>;
    $[32] = t12;
  } else {
    t12 = $[32];
  }
  let t13;
  if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = <Text>{"      "}{t12}{"                                       "}<Text dimColor={true}>*</Text><Text> </Text></Text>;
    $[33] = t13;
  } else {
    t13 = $[33];
  }
  let t14;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = <Text>{"      "}<Text color="clawd_body"> ░████████░</Text><Text>{"                        "}</Text><Text bold={true}>*</Text><Text>{"                "}</Text></Text>;
    $[34] = t14;
  } else {
    t14 = $[34];
  }
  let t15;
  if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = <Text>{"      "}<Text color="clawd_body">░██░░██░░██░</Text><Text>{"     *                                   "}</Text></Text>;
    $[35] = t15;
  } else {
    t15 = $[35];
  }
  let t16;
  if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = <Text>{"      "}<Text color="clawd_body">░██████████░</Text><Text>{"     *                                   "}</Text></Text>;
    $[36] = t16;
  } else {
    t16 = $[36];
  }
  let t17;
  if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = <Box width={WELCOME_V2_WIDTH}><Text>{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t13}{t14}{t15}{t16}<Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}<Text color="clawd_body">{"\u2588  \u2588  \u2588  \u2588"}</Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text></Text></Box>;
    $[37] = t17;
  } else {
    t17 = $[37];
  }
  return t17;
}
type AppleTerminalWelcomeV2Props = {
  theme: string;
  welcomeMessage: string;
};
function AppleTerminalWelcomeV2(t0: any) {
  const $ = _c(47);
  const {
    theme,
    welcomeMessage
  } = t0;
  const isLightTheme = ["light", "light-daltonized", "light-ansi"].includes(theme);
  if (isLightTheme) {
    let t1;
    if ($[0] !== welcomeMessage) {
      t1 = <Text color="claude">{welcomeMessage} </Text>;
      $[0] = welcomeMessage;
      $[1] = t1;
    } else {
      t1 = $[1];
    }
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = <Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text>;
      $[2] = t2;
    } else {
      t2 = $[2];
    }
    let t3;
    if ($[3] !== t1) {
      t3 = <Text>{t1}{t2}</Text>;
      $[3] = t1;
      $[4] = t3;
    } else {
      t3 = $[4];
    }
    let t10;
    let t11;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
      t4 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text>;
      t5 = <Text>{"                                                          "}</Text>;
      t6 = <Text>{"                                                          "}</Text>;
      t7 = <Text>{"                                                          "}</Text>;
      t8 = <Text>{"            \u2591\u2591\u2591\u2591\u2591\u2591                                        "}</Text>;
      t9 = <Text>{"    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                      "}</Text>;
      t10 = <Text>{"   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                    "}</Text>;
      t11 = <Text>{"                                                          "}</Text>;
      $[5] = t10;
      $[6] = t11;
      $[7] = t4;
      $[8] = t5;
      $[9] = t6;
      $[10] = t7;
      $[11] = t8;
      $[12] = t9;
    } else {
      t10 = $[5];
      t11 = $[6];
      t4 = $[7];
      t5 = $[8];
      t6 = $[9];
      t7 = $[10];
      t8 = $[11];
      t9 = $[12];
    }
    let t12;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = <Text><Text dimColor={true}>{"                           \u2591\u2591\u2591\u2591"}</Text><Text>{"                     \u2588\u2588    "}</Text></Text>;
      $[13] = t12;
    } else {
      t12 = $[13];
    }
    let t13;
    let t14;
    let t15;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
      t13 = <Text><Text dimColor={true}>{"                         \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591"}</Text><Text>{"               \u2588\u2588\u2592\u2592\u2588\u2588  "}</Text></Text>;
      t14 = <Text>{"                                            \u2592\u2592      \u2588\u2588   \u2592"}</Text>;
      t15 = <Text>{"                                          \u2592\u2592\u2591\u2591\u2592\u2592      \u2592 \u2592\u2592"}</Text>;
      $[14] = t13;
      $[15] = t14;
      $[16] = t15;
    } else {
      t13 = $[14];
      t14 = $[15];
      t15 = $[16];
    }
    let t16;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
      t16 = <Text>{"      "}<Text color="clawd_body">░░████░░  </Text>{"                           \u2592\u2592         \u2592\u2592 "}</Text>;
      $[17] = t16;
    } else {
      t16 = $[17];
    }
    let t17;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
      t17 = <Text>{"      "}<Text color="clawd_body">░████████░</Text>{"                           \u2591          \u2592   "}</Text>;
      $[18] = t17;
    } else {
      t17 = $[18];
    }
    let t18;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
      t18 = <Text>{"      "}<Text color="clawd_body">░██░░██░░██░</Text>{"                           "}</Text>;
      $[19] = t18;
    } else {
      t18 = $[19];
    }
    let t19;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
      t19 = <Text>{"      "}<Text color="clawd_body">░██████████░</Text>{"                           "}</Text>;
      $[20] = t19;
    } else {
      t19 = $[20];
    }
    let t20;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
      t20 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}<Text backgroundColor="clawd_body"> </Text><Text> </Text><Text backgroundColor="clawd_body"> </Text><Text>{"   "}</Text><Text backgroundColor="clawd_body"> </Text><Text> </Text><Text backgroundColor="clawd_body"> </Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2591\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2592\u2026\u2026\u2026\u2026"}</Text>;
      $[21] = t20;
    } else {
      t20 = $[21];
    }
    let t21;
    if ($[22] !== t3) {
      t21 = <Box width={WELCOME_V2_WIDTH}><Text>{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}{t16}{t17}{t18}{t19}{t20}</Text></Box>;
      $[22] = t3;
      $[23] = t21;
    } else {
      t21 = $[23];
    }
    return t21;
  }
  let t1;
  if ($[24] !== welcomeMessage) {
    t1 = <Text color="claude">{welcomeMessage} </Text>;
    $[24] = welcomeMessage;
    $[25] = t1;
  } else {
    t1 = $[25];
  }
  let t2;
  if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = <Text dimColor={true}>v{MACRO.DISPLAY_VERSION ?? MACRO.VERSION} </Text>;
    $[26] = t2;
  } else {
    t2 = $[26];
  }
  let t3;
  if ($[27] !== t1) {
    t3 = <Text>{t1}{t2}</Text>;
    $[27] = t1;
    $[28] = t3;
  } else {
    t3 = $[28];
  }
  let t4;
  let t5;
  let t6;
  let t7;
  let t8;
  let t9;
  if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text>;
    t5 = <Text>{"                                                          "}</Text>;
    t6 = <Text>{"     *                                       \u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2591     "}</Text>;
    t7 = <Text>{"                                 *         \u2588\u2588\u2588\u2593\u2591     \u2591\u2591   "}</Text>;
    t8 = <Text>{"            \u2591\u2591\u2591\u2591\u2591\u2591                        \u2588\u2588\u2588\u2593\u2591           "}</Text>;
    t9 = <Text>{"    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                      \u2588\u2588\u2588\u2593\u2591           "}</Text>;
    $[29] = t4;
    $[30] = t5;
    $[31] = t6;
    $[32] = t7;
    $[33] = t8;
    $[34] = t9;
  } else {
    t4 = $[29];
    t5 = $[30];
    t6 = $[31];
    t7 = $[32];
    t8 = $[33];
    t9 = $[34];
  }
  let t10;
  let t11;
  let t12;
  let t13;
  let t14;
  if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = <Text><Text>{"   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591    "}</Text><Text bold={true}>*</Text><Text>{"                \u2588\u2588\u2593\u2591\u2591      \u2593   "}</Text></Text>;
    t11 = <Text>{"                                             \u2591\u2593\u2593\u2588\u2588\u2588\u2593\u2593\u2591    "}</Text>;
    t12 = <Text dimColor={true}>{" *                                 \u2591\u2591\u2591\u2591                   "}</Text>;
    t13 = <Text dimColor={true}>{"                                 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                 "}</Text>;
    t14 = <Text dimColor={true}>{"                               \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591           "}</Text>;
    $[35] = t10;
    $[36] = t11;
    $[37] = t12;
    $[38] = t13;
    $[39] = t14;
  } else {
    t10 = $[35];
    t11 = $[36];
    t12 = $[37];
    t13 = $[38];
    t14 = $[39];
  }
  let t15;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = <Text>{"                                                      "}<Text dimColor={true}>*</Text><Text> </Text></Text>;
    $[40] = t15;
  } else {
    t15 = $[40];
  }
  let t16;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = <Text>{"        "}<Text color="clawd_body">░████████░</Text><Text>{"                       "}</Text><Text bold={true}>*</Text><Text>{"                "}</Text></Text>;
    $[41] = t16;
  } else {
    t16 = $[41];
  }
  let t17;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = <Text>{"        "}<Text color="clawd_body">░██░░██░░██░</Text><Text>{"      *                                   "}</Text></Text>;
    $[42] = t17;
  } else {
    t17 = $[42];
  }
  let t18;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = <Text>{"        "}<Text color="clawd_body">░██████████░</Text><Text>{"      *                                   "}</Text></Text>;
    $[43] = t18;
  } else {
    t18 = $[43];
  }
  let t19;
  if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = <Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}<Text backgroundColor="clawd_body"> </Text><Text> </Text><Text backgroundColor="clawd_body"> </Text><Text>{"   "}</Text><Text backgroundColor="clawd_body"> </Text><Text> </Text><Text backgroundColor="clawd_body"> </Text>{"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026"}</Text>;
    $[44] = t19;
  } else {
    t19 = $[44];
  }
  let t20;
  if ($[45] !== t3) {
    t20 = <Box width={WELCOME_V2_WIDTH}><Text>{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}{t16}{t17}{t18}{t19}</Text></Box>;
    $[45] = t3;
    $[46] = t20;
  } else {
    t20 = $[46];
  }
  return t20;
}
