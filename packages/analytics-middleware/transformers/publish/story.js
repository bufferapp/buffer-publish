import PropTypes from 'prop-types';

const notify = (...params) => {
  if (typeof console !== 'undefined') {
    console.error(...params); // eslint-disable-line
  }
};

/**
 * removeNullObjectKeys
 * Function to remove null props from segment data object
 *
 * @param props {Object} Data you want to filter down to not null properties
 * @returns {Object} mapped object with null props filtered out
 */
const removeNullObjectKeys = (data) => {
  const segmentData = {};

  if (data) {
    Object.keys(data)
      .filter(key => data[key] !== null)
      .forEach((key) => {
        segmentData[key] = data[key];
      });
  }

  return segmentData;
};

/**
 * Story Dragged
 * When did the user drag and drop a story in the storygroup?
 * More info about this event available in tracking plan repo:
 * https://github.com/bufferapp/tracking-plan/blob/master/tracking-plans/buffer-tracking-plan/events/product/publish/story-dragged.yaml
 *
 * @param [product] {string} The product for which the storygroup was created
 * @param channel {string} The channel's service, ex. "facebook"
 * @param channelId {string} The database id for the channel document
 * @param channelServiceId {string} The service's own id for this channel
 * @param clientId {string|null} What was the unique identifier of the client the user was in when they dragged the story?
 * @param clientName {string|null} Which client was the user in when they dragged the story? IE, `publishIos`, `publishWeb`, `publishAndroid`.
 *
 * @returns {{channelServiceId: *, product: *, clientId: *, clientName: *, channel: *, channelId: *}}
 */
export const dragged = ({
  product = null,
  channel = null,
  channelId = null,
  channelServiceId = null,
  clientId = null,
  clientName = null,
}) => {
  if (clientId === null && clientName === null) {
    notify('storyDrag - clientName or clientId must be supplied');
  }
  const draggedSegment = {
    product,
    channel,
    channelId,
    channelServiceId,
    clientId,
    clientName,
  };

  return removeNullObjectKeys(draggedSegment);
};

dragged.propTypes = {
  product: PropTypes.string,
  channel: PropTypes.string,
  channelId: PropTypes.string.isRequired,
  channelServiceId: PropTypes.string,
  clientId: PropTypes.string,
  clientName: PropTypes.string,
};