const { getDateString, isInThePast } = require('../../formatters/src');
const { parseTwitterLinks, parseFacebookEntities } = require('./linkParsing');

const getImageUrls = post => {
  if (!(post.media && post.media.picture && post.extra_media)) return [];
  const imageUrls = post.extra_media.map(media => media.photo);

  imageUrls.unshift(post.media.picture);
  return imageUrls;
};

const getPostActionString = ({ post }) => {
  const timestampToConvert = post.sent_at || post.due_at;
  // due_at set to 0 when user has no scheduled posting times
  if (timestampToConvert === 0) {
    return 'No Time Set';
  }
  const dateString = getDateString(timestampToConvert, post.profile_timezone, {
    twentyFourHourTime: post.twentyfour_hour_time,
  });

  // to run in every situation except when can_send_direct is explicitly false.
  // if pinned is explicitly set to true, then post is not custom scheduled
  if (
    post.scheduled_at &&
    post.can_send_direct !== false &&
    post.pinned !== true
  ) {
    return `This post ${
      post.sent_at ? 'was' : 'is'
    } custom scheduled for ${dateString}.`;
  }

  if (
    post.profile_service === 'instagram' &&
    !post.can_send_direct &&
    !post.sent_at
  ) {
    return `You will receive a reminder on ${dateString} when it's time to post.`;
  }

  return `This post ${post.sent_at ? 'was' : 'will be'} sent ${dateString}.`;
};

const getPostError = ({error, status}) => {
  if (status !== 'error') {
    return null;
  }
  const isObject = typeof error === 'object' && error !== null;
  return isObject ? error.text || '' : error || '';
};

const getPostDetails = ({ post }) => ({
  postAction: getPostActionString({ post }),
  isRetweet: post.retweet !== undefined,
  error: getPostError({ error: post.error, status: post.status }),
  errorLink: post.status === 'error' && post.error && post.error.link ? post.error.link : null,
  isCustomScheduled: post.scheduled_at ? true : false,
  isInstagramReminder:
    post.profile_service === 'instagram' && !post.can_send_direct
      ? true
      : false,
});

const getRetweetProfileInfo = post => {
  const retweet = post.retweet;
  if (!retweet) {
    return undefined;
  }

  return {
    name: retweet.profile_name || retweet.display_name || 'UNKNOWN',
    handle: `@${retweet.username || retweet.user_name || 'UNKNOWN'}`,
    avatarUrl:
      (retweet.avatars && retweet.avatars.https) ||
      retweet.avatar_https ||
      'https://static.buffer.com/images/app/placeholder-twitter.png',
  };
};

const getPostType = ({ post }) => {
  if (!post.media || post.retweet) {
    return 'text';
  } else if (post.media && post.media.picture && !post.extra_media) {
    return 'image';
  } else if (post.media && post.media.picture && post.extra_media) {
    return 'multipleImage';
  } else if (post.media && post.media.video) {
    return 'video';
  } else if (post.media && post.media.link) {
    return 'link';
  }
  return 'text';
};

const getUser = post => {
  if (!post.user) return;

  return {
    email: post.user.email,
    name: post.user.name,
    gravatar: post.user.gravatar,
    avatar: post.user.avatar,
    id: post.user_id,
  };
};

const removeDuplicates = (arr, prop) => {
  let obj = {};
  return Object.keys(
    arr.reduce((prev, next) => {
      if (!obj[next[prop]]) obj[next[prop]] = next;
      return obj;
    }, obj)
  ).map(i => obj[i]);
};

module.exports = post => {
  const media = post.media || {};
  const isVideo = media.video;
  let retweetComment;
  let text;

  if (post.retweet) {
    text = post.retweet.text;
    retweetComment = post.retweet.comment;
  } else {
    text = post.text;
  }

  const canHaveLinks =
    post.profile_service === 'twitter' || post.profile_service === 'facebook';

  const facebookLinks =
    post.profile_service === 'facebook'
      ? parseFacebookEntities(text, post.entities)
      : [];

  const otherLinks = parseTwitterLinks(text);

  const safeOtherLinks = otherLinks.filter(link => {
    const startIdx = link.indices[0];
    const endIdx = link.indices[1];
    const hasClash = facebookLinks.some(facebookLink => {
      const facebookStartIdx = facebookLink.indices[0];
      const facebookEndIdx = facebookLink.indices[1];
      const safe = endIdx < facebookStartIdx || startIdx > facebookEndIdx;
      return !safe;
    });
    return !hasClash;
  });

  const linksCreator = facebookLinks
    .concat(safeOtherLinks)
    .sort(
      ({ indices: [startIdxA] }, { indices: [startIdxB] }) =>
        startIdxA - startIdxB
    );

  const links = removeDuplicates(linksCreator, 'indices');

  const retweetCommentLinks = canHaveLinks
    ? parseTwitterLinks(retweetComment)
    : [];

  const isFixed = Boolean(post.error);

  const isPastDue = isInThePast(post.scheduled_at);

  return {
    day: post.day,
    id: post.id,
    createdAt: post.created_at,
    entities: post.entities,
    profileId: post.profile_id,
    isConfirmingDelete: post.isDeleting && !post.requestingDraftAction,
    isDeleting: post.isDeleting && post.requestingDraftAction,
    isWorking: !post.isDeleting && post.requestingDraftAction,
    isMoving: post.isMoving,
    isPastDue,
    imageSrc: isVideo ? media.thumbnail : media.picture,
    imageUrls: getImageUrls(post),
    shopgridLink: post.link,
    links: canHaveLinks ? links : [],
    profileTimezone: post.profile_timezone,
    linkAttachment: {
      title: media.title,
      url: media.expanded_link,
      description: media.description,
      thumbnailUrl: media.preview,
    },
    needsApproval: post.needs_approval,
    postDetails: getPostDetails({ post }),
    profile_service: post.profile_service,
    retweet: post.retweet,
    retweetComment,
    retweetCommentLinks,
    retweetProfile: getRetweetProfileInfo(post),
    isSent: post.status === 'sent',
    source_url: post.source_url,
    text,
    type: getPostType({ post }),
    media,
    extra_media: post.extra_media,
    subprofile_id: post.subprofile_id,
    due_at: post.due_at,
    scheduled_at: post.scheduled_at,
    scheduledAt: post.scheduled_at,
    sharedNext: post.shared_next,
    pinned: post.pinned,
    isFixed,
    statistics: post.statistics,
    service_geolocation_id: post.service_geolocation_id,
    service_geolocation_name: post.service_geolocation_name,
    service_user_tags: post.service_user_tags,
    user: getUser(post),
    serviceLink: post.service_link,
    dueTime: post.due_time,
    sharedBy: post.shared_by,
    commentEnabled: post.comment_enabled,
    commentText: post.comment_text,
    campaignDetails: post.campaign_details ? post.campaign_details : null,
  };
};
