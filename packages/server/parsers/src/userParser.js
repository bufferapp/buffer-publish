const hasProTrialExpired = trials =>
  trials.some(trial => trial.is_awesome && trial.status === 'expired')

const isOnBusinessPlan = trialPlan =>
  ['business', 'agency', 'small', 'premium_business'].some(
    plan => plan === trialPlan,
  )

module.exports = userData => ({
  id: userData.id,
  email: userData.email,
  name: userData.name,
  createdAt: userData.created_at,
  features: userData.features,
  hasTwentyFourHourTimeFormat: userData.twentyfour_hour_time,
  imageDimensionsKey: userData.imagedimensions_key,
  plan: userData.plan,
  planCode: userData.plan_code,
  is_business_user: userData.plan_code >= 9 && userData.plan_code <= 19,
  is_free_user: userData.plan === 'free',
  messages: userData.messages || [],
  new_contributions_emails_subscribe_link:
    userData.new_contributions_emails_subscribe_link,
  skip_empty_text_alert: userData.messages.includes(
    'remember_confirm_saving_modal',
  ),
  profile_groups: userData.profile_groups || [],
  s3_upload_signature: userData.s3_upload_signature,
  uses_24h_time: userData.twentyfour_hour_time,
  week_starts_monday: userData.week_starts_monday,
  has_ig_direct_flip: userData.features.includes('instagram_direct_posting'),
  twofactor: userData.twofactor,
  has_simplified_free_plan_ux: userData.features.includes(
    'has_simplified_free_plan_ux',
  ),
  hasIGLocationTaggingFeature: userData.features.includes(
    'instagram-location-tagging',
  ),
  hasIGDirectVideoFlip: userData.features.includes('ig_direct_video_posting'),
  profile_limit: userData.profile_limit,
  profiles_schedules_slots: userData.profiles_schedules_slots,
  hasNewPublish: userData.in_new_publish_rollout,
  hasEmailNotifications: {
    bufferEmpty: userData.email_notifications.includes('buffer_empty'),
    bufferTips: userData.email_notifications.includes('buffer_tips'),
    updateFailures: userData.email_notifications.includes('update_failures'),
    updateSuccesses: userData.email_notifications.includes('update_successes'),
    weeklyDigests: userData.email_notifications.includes('weekly_digests'),
    newContributions: userData.email_notifications.includes(
      'new_contributions',
    ),
    postMovedBackToDrafts: userData.email_notifications.includes(
      'post_moved_back_to_drafts',
    ),
    celebrations: userData.email_notifications.includes('celebrations'),
  },
  canStartBusinessTrial: userData.can_start_business_trial,
  shouldShowProTrialExpiredModal:
    hasProTrialExpired(userData.feature_trials) &&
    userData.plan === 'free' &&
    !userData.has_cancelled,
  shouldShowBusinessTrialExpiredModal:
    isOnBusinessPlan(userData.trial_plan) && userData.trial_expired,
  trial: userData.on_awesome_trial
    ? {
        hasCardDetails: userData.has_card_details,
        hasTrialExtended: userData.has_trial_extended,
        onTrial: userData.on_awesome_trial,
        postTrialCost: '',
        trialLength: userData.awesome_trial_length,
        trialTimeRemaining: userData.awesome_trial_time_remaining,
      }
    : {
        hasCardDetails: userData.has_card_details,
        hasTrialExtended: userData.has_trial_extended,
        onTrial: userData.on_trial,
        postTrialCost: userData.post_trial_cost,
        trialLength: userData.trial_length,
        trialTimeRemaining: userData.trial_time_remaining,
      },
  messages: userData.messages,
  isNonprofit: userData.billing_status_nonprofit,
  orgUserCount: userData.org_user_count,
  profileCount: userData.profile_usage,
  showReturnToClassic: userData.features.includes('paid_users_in_new_publish'),
})
