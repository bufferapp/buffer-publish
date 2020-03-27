import parsers from '../../../parsers/src';
import RPCEndpoint from '.';

const session = {
  publish: {
    accessToken: '',
  },
};

const params = {
  name: 'Test',
  color: '#ffffff',
};

const CREATE_CAMPAIGN_RESPONSE = {
  data: {
    _id: '123456',
    global_organization_id: '000111',
    name: 'Test',
    color: '#ffffff',
    created_at: 1583166077,
    updated_at: 1583166098,
  },
  success: true,
};

const PublishAPI = {
  post: jest.fn(),
  get: jest.fn(),
};

const createCampaign = () =>
  RPCEndpoint.fn(params, { session }, null, {
    PublishAPI,
    parsers,
  });

describe('RPC | Create campaign', () => {
  it('creates a campaign correctly', async () => {
    PublishAPI.post.mockResolvedValueOnce(CREATE_CAMPAIGN_RESPONSE);
    await createCampaign(params).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe(params.name);
      expect(response.color).toBe(params.color);
      expect(response.lastUpdated).toContain('Updated ');
      expect(response.channels).toBeNull();
      expect(response.items).toBeNull();
    });
    expect(PublishAPI.post).toBeCalled();
  });

  it('fails to create campaign due to missing params', async () => {
    PublishAPI.post.mockRejectedValueOnce(new TypeError('Missing param: name'));
    try {
      await createCampaign({
        color: '#ffffff',
      }).then(response => {
        throw new TypeError(response);
      });
    } catch (err) {
      expect(err.message).toEqual('Missing param: name');
    }
    expect(PublishAPI.post).toBeCalled();
  });
});
