import RPCEndpoint from '.';

const post = require('../../../publishAPI/post');

jest.mock('../../../publishAPI/post');

const accessToken = 'AN ACCESS TOKEN';
const session = {
  publish: {
    accessToken,
  },
};

const campaignId = '223344';
const params = {
  campaignId,
  name: 'Test',
  color: '#bebebe',
};

const updateCampaign = () => RPCEndpoint.fn(params, { session });
const UPDATE_CAMPAIGN_RESPONSE = {
  data: {
    _id: '123456',
    global_organization_id: '000111',
    name: 'Test',
    color: '#bebebe',
    created_at: 1583166077,
    updated_at: 1583166098,
  },
  success: true,
};

describe('RPC | Update campaign', () => {
  it('updates a campaign correctly', async () => {
    post.mockReturnValueOnce(Promise.resolve(UPDATE_CAMPAIGN_RESPONSE));
    await updateCampaign(params).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe(params.name);
      expect(response.color).toBe(params.color);
      expect(response.lastUpdated).toContain('Last updated ');
    });
  });

  it('fails to update a campaign due to missing params', async () => {
    post.mockReturnValueOnce(
      Promise.reject(new TypeError('Missing campaign id'))
    );
    try {
      await updateCampaign({
        name: 'Test',
        color: '#ffffff',
      }).then(response => {
        throw new TypeError(response);
      });
    } catch (err) {
      expect(err.message).toEqual('Missing campaign id');
    }
  });
});
