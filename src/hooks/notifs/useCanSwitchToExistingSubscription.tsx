import * as React from 'react';
import { getOauthProfileFromApiKey } from 'src/services/oauth/getOauthProfile.js';
import { isZeroAISubscriber } from 'src/utils/auth.js';
import { Text } from '../../ink.js';
import { logEvent } from '../../services/analytics/index.js';
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js';
import { useStartupNotification } from './useStartupNotification.js';
const MAX_SHOW_COUNT = 3;

/**
 * Hook to check if the user has a subscription on Console but isn't logged into it.
 */
export function useCanSwitchToExistingSubscription() {
  useStartupNotification(_temp2);
}

/**
 * Checks if the user has a subscription but is not currently logged into it.
 * This helps inform users they should run /login to access their subscription.
 */
async function _temp2() {
  if ((getGlobalConfig().subscriptionNoticeCount ?? 0) >= MAX_SHOW_COUNT) {
    return null;
  }
  const subscriptionType = await getExistingZeroSubscription();
  if (subscriptionType === null) {
    return null;
  }
  saveGlobalConfig(_temp);
  logEvent("tengu_switch_to_subscription_notice_shown", {});
  return {
    key: "switch-to-subscription",
    jsx: <Text color="suggestion">Use your existing Zero {subscriptionType} plan with ZeroCLI<Text color="text" dimColor={true}>{" "}· /login to activate</Text></Text>,
    priority: "low" as const
  };
}
function _temp(current: ReturnType<typeof getGlobalConfig>) {
  return {
    ...current,
    subscriptionNoticeCount: (current.subscriptionNoticeCount ?? 0) + 1
  };
}
async function getExistingZeroSubscription(): Promise<'Max' | 'Pro' | null> {
  // If already using subscription auth, there is nothing to switch to
  if (isZeroAISubscriber()) {
    return null;
  }
  const profile = await getOauthProfileFromApiKey();
  if (!profile) {
    return null;
  }
  // @ts-expect-error - has_claude_max exists at runtime but is not in the typed account shape
  if (profile.account.has_claude_max) {
    return 'Max';
  }
  // @ts-expect-error - has_claude_pro exists at runtime but is not in the typed account shape
  if (profile.account.has_claude_pro) {
    return 'Pro';
  }
  return null;
}
