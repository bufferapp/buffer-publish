module.exports = orgData => ({
  id: orgData.id,
  globalOrgId: orgData.globalOrgId,
  locked: orgData.locked,
  selected: orgData.selected,
  name: orgData.name,
  ownerId: orgData.ownerId,
  ownerEmail: orgData.ownerEmail,
  ownerFeatures: orgData.ownerFeatures,
  plan: orgData.planName,
  planBase: orgData.planBase,
  planCode: orgData.planCode,
  isNonProfit: orgData.isNonProfit,
  profileLimit: orgData.profileLimit,
  profilesCount: orgData.profilesCount,
  usersCount: orgData.usersCount,
  isAdmin: orgData.isAdmin,
  isOwner: orgData.isOwner,
  trial: orgData.trial,

  // Plan Features
  hasCampaignsFeature: orgData.planBase !== 'free',
  hasAnalyticsFeature: orgData.planBase === 'business',
  hasBitlyFeature: orgData.planBase !== 'free',
  has30DaySentPostsLimitFeature: orgData.planBase === 'free', // profiles_controller updates_sent() returns only 30 days of sent posts for free users.
  hasCalendarFeature: orgData.planBase !== 'free',
  hasShareAgainFeature: orgData.planBase !== 'free',
  hasCustomizingUtmParamsFeature:
    orgData.planBase === 'business' && orgData.isOwner,
});
