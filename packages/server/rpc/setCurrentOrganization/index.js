const { method, createError } = require('@bufferapp/buffer-rpc');
const rp = require('request-promise');

module.exports = method(
  'setCurrentOrganization',
  'set current organization',
  ({ organizationId }, { session }) =>
    rp({
      uri: `${process.env.API_ADDR}/1/user/set_selected_organization.json`,
      method: 'POST',
      strictSSL: !(
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test'
      ),
      qs: {
        access_token: session.publish.accessToken,
        organization_id: organizationId,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    })
      .then(result => JSON.parse(result))
      .catch(err => {
        if (err.error) {
          const error = JSON.parse(err.error);
          throw createError({ message: error.message });
        }
      })
);
