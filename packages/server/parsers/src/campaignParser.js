const moment = require('moment-timezone');
const postParser = require('./postParser');
const { getDateString } = require('../../formatters/src/date');

const parseLastUpdated = updatedAt => {
  const updatedDate = new Date(updatedAt * 1000);
  const diff = moment(updatedDate).fromNow(true);

  return `Last updated ${diff} ago`;
};

const getYear = momentDate => momentDate.format('YYYY');
const getMonth = momentDate => momentDate.format('MM');
const getMomentDate = date => moment(new Date(date * 1000));
const isRangeFromSameYear = (start, end) => getYear(start) === getYear(end);
const isRangeFromSameMonth = (start, end) => getMonth(start) === getMonth(end);

const formatDateRange = ({
  momentStart,
  startFormat,
  momentEnd,
  endFormat,
}) => {
  const start = momentStart.format(startFormat);
  const end = momentEnd.format(endFormat);
  return `${start}-${end}`;
};

const parseDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return null;

  const momentStart = getMomentDate(startDate);
  const momentEnd = getMomentDate(endDate);

  let startFormat = 'MMM D YYYY';
  let endFormat = 'MMM D YYYY'; // Dec 25 2019-Jan 5 2020
  if (isRangeFromSameYear(momentStart, momentEnd)) {
    startFormat = 'MMM D';
    endFormat = isRangeFromSameMonth(momentStart, momentEnd)
      ? 'D, YYYY' // Jan 25-31, 2020
      : 'MMM D, YYYY'; // Mar 11-Apr 4, 2020
  }

  return formatDateRange({ momentStart, startFormat, momentEnd, endFormat });
};

const parseItem = item => {
  const itemContent = {};
  if (item.content) {
    // We'd need to add the other parsers here (storyGroups)
    if (item.type === 'update') {
      itemContent.content = postParser(item.content);
      const {
        createdAt,
        profileTimezone,
        profile_service,
        user,
      } = itemContent.content;
      // String with the date of the update creation
      const createdAtString =
        createdAt &&
        getDateString(createdAt, profileTimezone, {
          createdAt,
          twentyFourHourTime: false,
        });
      // Header details to be used in the CardHeader
      itemContent.content.headerDetails = {
        channel: {
          avatarUrl: item.service_avatar,
          handle: item.service_username,
          type: profile_service,
        },
        creatorName: user && user.name,
        avatarUrl: user && user.avatar,
        createdAt: createdAtString,
      };
    }
  }

  let sentAt = null;
  if (item.sent_at) {
    sentAt = { sentAt: item.sent_at };
  }

  let servicePostId = null;
  if (item.service_post_id) {
    servicePostId = { servicePostId: item.service_post_id };
  }

  const result = {
    id: item.id,
    _id: item.id,
    dueAt: item.due_at,
    type: item.type,
    serviceType: item.service_type,
    serviceId: item.service_id,
    channelType: item.channel_type,
    ...sentAt,
    ...servicePostId,
    ...itemContent,
  };

  return result;
};

const parseCampaignItems = items => {
  if (!items) return null;

  return items.map(item => {
    return parseItem(item);
  });
};

const parseChannels = channels => {
  if (!channels) return null;

  return channels.map(channel => {
    return {
      serviceId: channel.service_id,
      serviceType: channel.service_type,
      channelType: channel.channel_type,
    };
  });
};

module.exports = campaign => {
  return {
    _id: campaign._id,
    id: campaign._id,
    globalOrganizationId: campaign.global_organization_id,
    name: campaign.name,
    color: campaign.color,
    lastUpdated: parseLastUpdated(campaign.updated_at),
    updatedAt: campaign.updated_at,
    createdAt: campaign.created_at,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    dateRange: parseDateRange(campaign.start_date, campaign.end_date),
    sent: campaign.sent,
    scheduled: campaign.scheduled,
    channels: parseChannels(campaign.channels),
    items: parseCampaignItems(campaign.items),
  };
};
