import { QueueingTypes } from '../AppConstants';

const getComposerSource = ({ tabId, emptySlotMode }) => {
  let sourceName = null;
  switch (tabId) {
    case 'queue':
      /* emptyslotmode is true when a user opens the composer from an empty slot,
      which allows us to know the source is queue_list */
      sourceName = emptySlotMode ? 'queue_list' : 'queue';
      break;
    case 'awaitingApproval':
      sourceName = 'awaiting_approval';
      break;
    case 'drafts':
      sourceName = 'drafts';
      break;
    case 'analytics':
      sourceName = 'share_again';
      break;
    default:
      sourceName = tabId;
      break;
  }
  return sourceName;
};

const trackingShareTypeMap = new Map([
  [QueueingTypes.QUEUE, 'queue'],
  [QueueingTypes.NEXT, 'share_next'],
  [QueueingTypes.NOW, 'share_now'],
  [QueueingTypes.CUSTOM, 'custom'],
  [QueueingTypes.ADD_DRAFT, 'draft'],
  [QueueingTypes.NEXT_DRAFT, 'draft_share_next'],
  [QueueingTypes.CUSTOM_DRAFT, 'draft_custom'],
]);

const formatShareDate = shareDate => {
  if (shareDate) {
    const jsDate = new Date(shareDate * 1000);
    return jsDate ? jsDate.toISOString() : null;
  }
  return null;
};

const getSegmentMetadata = ({
  post = {},
  profile = {},
  formattedData = {},
  composerSource,
  queueingType,
}) => ({
  channel: post.profile_service || null,
  channelId: post.profile_id || null,
  channelServiceId: profile.serviceId || null,
  channelType: profile.serviceType || null,
  client: post.client ? post.client.name : null,
  composerSource: composerSource || null,
  hasFirstComment: !!formattedData.comment_text,
  hasLocation: !!formattedData.service_geolocation_id,
  hasShopGridLink: !!formattedData.link,
  isDraft: !!post.draft,
  mediaType: post.type || null,
  postId: post.id || null,
  shareDate: formatShareDate(post.due_at),
  shareType: trackingShareTypeMap.get(queueingType) || null,
});

const getSegmentCampaignMetadata = ({
  post = {},
  profile = {},
  composerSource,
}) => ({
  itemType: 'post',
  itemId: post.id || null,
  campaignId: post.campaign_details.id || null,
  campaignName: post.campaign_details.name || null,
  channel: post.profile_service || null,
  channelId: post.profile_id || null,
  channelType: profile.serviceType || null,
  addedFrom: composerSource || null,
  organizationId: post.organization_id || null,
});

export {
  getComposerSource,
  getSegmentMetadata,
  formatShareDate,
  getSegmentCampaignMetadata,
};
