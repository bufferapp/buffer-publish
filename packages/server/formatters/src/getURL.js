module.exports = {
  getBaseURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'local.buffer.com';
    }
    return 'buffer.com';
  },
  getClassicBufferURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/classic';
    }
    return 'https://buffer.com/classic';
  },
  getBackToClassicNewPublishBufferURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/back_publish';
    }
    return 'https://buffer.com/back_publish';
  },
  getManageURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/manage';
    }
    return 'https://buffer.com/manage';
  },
  getConnectSocialAccountURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/manage/accounts/connect';
    }
    return 'https://buffer.com/manage/accounts/connect';
  },
  getManageSocialAccountURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/manage/own';
    }
    return 'https://buffer.com/manage/own';
  },
  getManageTeamURL: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://local.buffer.com/manage/team-members';
    }
    return 'https://buffer.com/manage/team-members';
  },
  getInstagramDirectPostingURL: profileId => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/instagram/setup?profile_id=${profileId}`;
    }
    return `https://buffer.com/instagram/setup?profile_id=${profileId}`;
  },
  getConnectBitlyURL: profileId => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/oauth/bitly/${profileId}/auth`;
    }
    return `https://buffer.com/oauth/bitly/${profileId}/auth`;
  },
  getDisconnectBitlyURL: profileId => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/profile/disconnect_bitly_auth/${profileId}`;
    }
    return `https://buffer.com/profile/disconnect_bitly_auth/${profileId}`;
  },
  getStartTrialURL: ({ plan, cycle, trialType, cta, nextUrl }) => {
    const nextParam = nextUrl ? `&next=${nextUrl}` : '';
    // temporarily adding to rule out that unknown ctas are not coming from publish
    const ctaParam = cta
      ? `&cta=${cta}`
      : `&cta=publish-test-getStartTrialUrl-start${trialType}Trial-1`;
    // we are slowly deprecating trialType in favor of plan
    const planParam = trialType
      ? `trialType=${trialType}`
      : `plan=${plan}&cycle=${cycle}`;
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/billing/start-trial?${planParam}${ctaParam}${nextParam}`;
    }
    return `https://buffer.com/billing/start-trial?${planParam}${ctaParam}${nextParam}`;
  },
  getBillingURL: ({ cta }) => {
    const ctaParam = cta ? `&cta=${cta}` : '';
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/app/account/receipts?content_only=true${ctaParam}`;
    }
    return `https://buffer.com/app/account/receipts?content_only=true${ctaParam}`;
  },
  getRemindersURL: ({ profileId, cta, nextUrl }) => {
    const ctaParam = cta ? `cta=${cta}` : '';
    const encodedUrl = nextUrl && encodeURI(nextUrl);
    const nextParam = encodedUrl ? `&next=${encodedUrl}` : '';

    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://local.buffer.com/oauth/instagram/setup_reminders/${profileId}?${ctaParam}${nextParam}`;
    }
    return `https://buffer.com/oauth/instagram/setup_reminders/${profileId}?${ctaParam}${nextParam}`;
  },
  getPublishUrl: () => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return 'https://publish.local.buffer.com';
    }
    return 'https://publish.buffer.com';
  },
  getAnalyzeReportUrl: campaignId => {
    if (window.location.hostname === 'publish.local.buffer.com') {
      return `https://analyze.local.buffer.com/campaigns/${campaignId}`;
    }
    return `https://analyze.buffer.com/campaigns/${campaignId}`;
  },
};
