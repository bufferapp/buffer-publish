const { method } = require('@bufferapp/buffer-rpc');
const rp = require('request-promise');

module.exports = method(
  'createHashtagGroup',
  'create hashtag group',
  ({ organizationId, name, text }, { session }) =>
    rp({
      uri: `${process.env.API_ADDR}/1/snippet_groups/create.json`,
      method: 'POST',
      strictSSL: !(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'),
      qs: {
        access_token: session.publish.accessToken,
        organization_id: organizationId,
        name,
        text,
      },
    })
    .then(result => JSON.parse(result)),
);