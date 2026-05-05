#!/usr/bin/env node
/**
 * Preview script for WelcomeV2 ASCII art variations.
 * Usage: node scripts/welcome-preview.mjs [dark|light|apple-dark|apple-light|all]
 *
 * Extracts the actual render strings from WelcomeV2.tsx.
 */

const W = 58;
const ver = "0.8.6";
const dot = "\u2026".repeat(58);
const footer = "\u2026".repeat(7) + "\u2588 \u2588   \u2588 \u2588" + "\u2026".repeat(54);

// Cloud (left side) - shared between dark/light, non-Apple
const cloud = [
  "                                                          ",
  "                                                          ",
  "                                                          ",
  "     *                                       \u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2591     ",
  "                                 *         \u2588\u2588\u2588\u2593\u2591     \u2591\u2591   ",
  "            \u2591\u2591\u2591\u2591\u2591\u2591                        \u2588\u2588\u2588\u2593\u2591           ",
  "    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                      \u2588\u2588\u2588\u2593\u2591           ",
  "   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591    *                \u2588\u2588\u2593\u2591\u2591      \u2593   ",
  "                                             \u2591\u2593\u2593\u2588\u2588\u2588\u2593\u2593\u2591    ",
  " *                                 \u2591\u2591\u2591\u2591                   ",
  "                                 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                 ",
  "                               \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591           ",
];

// Shadow cloud (light theme)
const shadowCloud = [
  "                                                          ",
  "                                                          ",
  "                                                          ",
  "            \u2591\u2591\u2591\u2591\u2591\u2591                                        ",
  "    \u2591\u2591\u2591   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                      ",
  "   \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591                                    ",
  "                                                          ",
  "                           \u2591\u2591\u2591\u2591                     \u2588\u2588    ",
  "                         \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591               \u2588\u2588\u2592\u2592\u2588\u2588  ",
  "                                            \u2592\u2592      \u2588\u2588   \u2592",
  "                         \u2592\u2592\u2591\u2591\u2592\u2592      \u2592 \u2592\u2592",
  "                           \u2592\u2592         \u2592\u2592 ",
  "                            \u2591          \u2592   ",
];

// Logo block - standard terminal
const logoStd = [
  "       ░░████░░                                        *   ",
  "      ░████████░                    *                        ",
  "     ░██░░██░░██░                                            ",
  "     ░██████████░                                    *   ",
  "     ░██████████░                                          ",
  "     ░██████████░     *                                    ",
];

// Logo block - Apple Terminal (uses box-drawing)
const logoApple = [
  "                                                          *   ",
  "      ▗ ▗     ▖ ▖                       *                          ",
  "        \u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800                       *                          ",
];

// Footer line
function makeFooter(bodyColor) {
  const sep = "\u2026".repeat(19);
  return sep + bodyColor + "\u2026".repeat(42);
}

const header = (msg) => msg;

// === 4 variations ===
function renderDark() {
  const lines = [...cloud];
  lines.push(...logoStd);
  lines.push(footer);
  return ["Welcome to Zero CLI " + chalkDim(v) + " ", dot, ...lines].join("\n");
}

function renderLight() {
  const lines = [...shadowCloud];
  lines.push("       ░░████░░ ");
  lines.push("      ░████████░");
  lines.push("     ░██░░██░░██░");
  lines.push("     ░██████████░ ");
  lines.push("     ░██████████░");
  lines.push("     ░██████████░ ");
  lines.push(footer);
  return ["Welcome to Zero CLI " + chalkDim(v) + " ", dot, ...lines].join("\n");
}

function renderAppleDark() {
  const lines = [...cloud];
  lines.push("                                                      *   ");
  lines.push("        ▗ ▗     ▖ ▖                       *                          ");
  lines.push("        " + " ".repeat(9) + "                       *                          ");
  lines.push(footer);
  return ["Welcome to Zero CLI " + chalkDim(v) + " ", dot, ...lines].join("\n");
}

function renderAppleLight() {
  const lines = [...shadowCloud];
  lines.push("         ▗ ▗     ▖ ▖                           \u2592\u2592         \u2592\u2592 ");
  lines.push("          " + " ".repeat(9) + "                           \u2591          \u2592   ");
  lines.push(footer);
  return ["Welcome to Zero CLI " + chalkDim(v) + " ", dot, ...lines].join("\n");
}

function chalkDim(s) {
  return "\x1b[2m" + s + "\x1b[0m";
}

const v = ver;
const sep = "\n" + "\u2500".repeat(64) + "\n";

const target = process.argv[2] || "all";
const renderers = {
  "dark":        ["Dark Theme (non-Apple Terminal)",  renderDark],
  "light":       ["Light Theme (non-Apple Terminal)", renderLight],
  "apple-dark":  ["Dark Theme (Apple Terminal)",      renderAppleDark],
  "apple-light": ["Light Theme (Apple Terminal)",     renderAppleLight],
};

if (target === "all") {
  for (const [key, [label, fn]] of Object.entries(renderers)) {
    console.log("\x1b[1m" + label + "\x1b[0m\n");
    console.log(fn());
    if (key !== "apple-light") console.log(sep);
  }
} else if (renderers[target]) {
  console.log("\x1b[1m" + renderers[target][0] + "\x1b[0m\n");
  console.log(renderers[target][1]());
} else {
  console.log("Usage: node scripts/welcome-preview.mjs [dark|light|apple-dark|apple-light|all]");
  process.exit(1);
}
