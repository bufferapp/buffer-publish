import RPCEndpoint from '.';
import parsers from '../../../parsers/src';
import CAMPAIGNS_LIST from './listMock';

const session = {
  publish: {
    accessToken: '',
  },
};

const PublishAPI = { get: jest.fn() };
const geCampaignsList = () =>
  RPCEndpoint.fn(null, { session }, null, {
    PublishAPI,
    parsers,
  });

describe('RPC | Get list of campaigns', () => {
  it('gets the campaigns list successfully', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGNS_LIST);
    await geCampaignsList().then(response => {
      expect(response.length).toEqual(4);
      response.forEach(campaign => {
        expect(campaign.globalOrganizationId).toBe('123');
        expect(campaign.dateRange).not.toBeUndefined();
        expect(campaign.lastUpdated).toContain('Updated ');
      });
    });
  });

  it('fails to get list of campaigns', async () => {
    PublishAPI.get.mockRejectedValueOnce(new Error('Error ocurred'));
    try {
      await geCampaignsList().then(response => {
        throw new Error(response);
      });
    } catch (err) {
      expect(err.error).toBeUndefined();
      expect(err.message).toEqual('Error ocurred');
    }
  });
});
