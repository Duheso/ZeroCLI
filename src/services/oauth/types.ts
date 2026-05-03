// OAuth types - reconstructed from usage across the codebase

// Subscription and billing types
export type SubscriptionType = 'max' | 'pro' | 'free' | string
export type RateLimitTier = 'max' | 'pro' | 'free' | string
export type BillingType = 'individual' | 'organization' | string

// Token exchange response from the OAuth server
export interface OAuthTokenExchangeResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  account?: {
    uuid: string
    email_address: string
  }
  organization?: {
    uuid: string
  }
}

// Profile response from the OAuth server
export interface OAuthProfileResponse {
  account: {
    uuid: string
    email: string
    display_name?: string
    created_at: string
  }
  organization: {
    uuid: string
    organization_type: string
    has_extra_usage_enabled?: boolean
    billing_type?: string
    subscription_created_at?: string
  }
  subscription_type?: SubscriptionType
  subscription_status?: string
  subscription_billing_type?: BillingType
  rate_limit_tier?: RateLimitTier
  has_extra_usage_enabled?: boolean
  subscription_created_at?: string
  account_created_at?: string
  display_name?: string
}

// Tokens stored in config
export interface OAuthTokens {
  accessToken: string
  refreshToken: string | null
  expiresAt: number | null
  scopes: string[]
  subscriptionType: SubscriptionType | null
  rateLimitTier: RateLimitTier | null
  profile?: OAuthProfileResponse
  tokenAccount?: {
    uuid: string
    emailAddress: string
    organizationUuid?: string
  }
}

// User roles response
export interface UserRolesResponse {
  organization_role: string
  workspace_role: string
  organization_name: string
}

// Referral types
export type ReferralCampaign = 'claude_code_guest_pass' | string

export interface ReferralEligibilityResponse {
  eligible: boolean
  reason?: string
  campaign: ReferralCampaign
  referral_code: string
  remaining_passes?: number
  referrer_reward?: ReferrerRewardInfo
}

export interface ReferralRedemptionsResponse {
  redemptions: {
    code: string
    redeemed_at: string
    redemption_campaign?: string
  }[]
  total: number
}

export interface ReferrerRewardInfo {
  amount_minor_units: number
  currency: string
  reward_type: string
}
