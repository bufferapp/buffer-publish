/* eslint-disable no-unused-vars */
const { method } = require('@bufferapp/buffer-rpc');

module.exports = method(
  'getGlobalOrganizationId',
  'gets the global organization ID of the users main organization',
  (__, { session }, res, { PublishAPI }) =>
    PublishAPI.get({
      uri: `/1/user/get_global_organization_id.json`,
      session,
      params: {},
    }).catch(PublishAPI.errorHandler)
);
