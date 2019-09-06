const { method, createError } = require('@bufferapp/buffer-rpc');
const rp = require('request-promise');

module.exports = method(
  'createStoryGroup',
  'fetch stories groups',
  ({ profileId, scheduledAt, stories }, { session }) =>
    rp({
      uri: `${process.env.API_ADDR}/1/story_groups/create.json`,
      method: 'POST',
      strictSSL: !(process.env.NODE_ENV === 'development'),
      qs: {
        access_token: session.publish.accessToken,
        profile_id: profileId,
        scheduled_at: scheduledAt,
        stories,
      },
    })
      .then(result => JSON.parse(result))
      .catch((err) => {
        if (err.error) {
          const error = JSON.parse(err.error);
          throw createError({ message: error.message });
        }
      }),
);
