import RPCEndpoint from '.';
import parsers from '../../../parsers/src';

const session = {
  publish: {
    accessToken: '',
  },
};

const params = ({ past = false, fullItems = false }) => {
  return {
    campaignId: '123456',
    past,
    fullItems,
  };
};

const PublishAPI = { get: jest.fn() };
const getCampaign = ({ past, fullItems }) =>
  RPCEndpoint.fn(params({ past, fullItems }), { session }, null, {
    PublishAPI,
    parsers,
  });

const CAMPAIGN = {
  data: {
    id: '123456',
    _id: '123456',
    name: 'My campaign',
    color: '#BD3381',
    global_organization_id: '000111',
    created_at: 1583166077,
    updated_at: 1583166098,
    sent: 0,
    scheduled: 0,
  },
  success: true,
};

const CAMPAIGN_WITH_SCHEDULED_ITEMS = {
  data: {
    ...CAMPAIGN.data,
    scheduled: 2,
    sent: 1,
    start_date: 1583946000,
    end_date: 1585998540,
    items: [
      {
        id: '123',
        type: 'update',
        due_at: 1583946000,
        service_type: 'twitter',
        service_id: 96414483,
        channel_type: 'profile',
      },
      {
        id: '124',
        type: 'update',
        due_at: 1585998540,
        service_type: 'twitter',
        service_id: 96414483,
        channel_type: 'profile',
      },
    ],
  },
  success: true,
};

const CAMPAIGN_WITH_SCHEDULED_ITEMS_FULL = {
  data: {
    ...CAMPAIGN.data,
    scheduled: 2,
    sent: 1,
    start_date: 1583946000,
    end_date: 1585998540,
    items: [
      {
        id: '123',
        type: 'update',
        due_at: 1583946000,
        service_type: 'twitter',
        service_id: 96414483,
        channel_type: 'profile',
        content: {
          text: 'My Update 1',
          type: 'text',
        },
      },
      {
        id: '124',
        type: 'update',
        due_at: 1585998540,
        service_type: 'twitter',
        service_id: 96414483,
        channel_type: 'profile',
        content: {
          text: 'My Update 1',
          type: 'text',
        },
      },
    ],
  },
  success: true,
};

const CAMPAIGN_WITH_SENT_ITEMS = {
  data: {
    ...CAMPAIGN.data,
    scheduled: 2,
    sent: 1,
    start_date: 1583946000,
    end_date: 1585998540,
    items: [
      {
        id: '123',
        type: 'update',
        due_at: 1583946000,
        service_type: 'twitter',
        service_id: 96414483,
        channel_type: 'profile',
        service_post_id: '12345',
        sent_at: 1583946000,
      },
    ],
  },
  success: true,
};

const CAMPAIGN_DATE_RANGE_SAME_MONTH = {
  data: {
    ...CAMPAIGN.data,
    start_date: 1583514000,
    end_date: 1583839380,
  },
  success: true,
};

const CAMPAIGN_DATE_RANGE_DIFF_MONTH_YEAR = {
  data: {
    ...CAMPAIGN.data,
    start_date: 1577491200,
    end_date: 1583839380,
  },
  success: true,
};

const itemParams = ['dueAt', 'serviceId', 'serviceType', 'channelType'];

describe('RPC | Get campaign', () => {
  it('gets the campaign without items correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN);
    await getCampaign({ past: false }).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe('My campaign');
      expect(response.color).toBe('#BD3381');
      expect(response.lastUpdated).toContain('Updated ');
      expect(response.dateRange).toBeNull();
      expect(response.items).toBeNull();
    });
  });

  it('gets the campaign with items with full items correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_WITH_SCHEDULED_ITEMS_FULL);
    await getCampaign({ past: false, fullItems: true }).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe('My campaign');
      expect(response.color).toBe('#BD3381');
      expect(response.lastUpdated).toContain('Updated ');
      expect(response.dateRange).not.toBeUndefined();
      expect(response.items).not.toBeNull();
      response.items.forEach(item => {
        expect(item.text).not.toBeUndefined();
      });
    });
  });

  it('gets the campaign with scheduled items correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_WITH_SCHEDULED_ITEMS);
    await getCampaign({ past: false }).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe('My campaign');
      expect(response.color).toBe('#BD3381');
      expect(response.dateRange).not.toBeUndefined();
      expect(response.lastUpdated).toContain('Updated ');
      expect(response.items.length).toBe(2);
    });
  });

  it('parses date range, with same year and different month correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_WITH_SCHEDULED_ITEMS);
    await getCampaign({ past: false }).then(response => {
      expect(response.dateRange).toBe('Mar 11-Apr 4, 2020');
    });
  });

  it('parses date range, with same year and month correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_DATE_RANGE_SAME_MONTH);
    await getCampaign({ past: false }).then(response => {
      expect(response.dateRange).toBe('Mar 6-10, 2020');
    });
  });

  it('parses date range, with different year and month correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_DATE_RANGE_DIFF_MONTH_YEAR);
    await getCampaign({ past: false }).then(response => {
      expect(response.dateRange).toBe('Dec 28 2019-Mar 10 2020');
    });
  });

  it('gets the campaign with scheduled items correctly', async () => {
    PublishAPI.get.mockResolvedValueOnce(CAMPAIGN_WITH_SENT_ITEMS);
    await getCampaign({ past: false }).then(response => {
      expect(response.id).toBe('123456');
      expect(response.globalOrganizationId).toBe('000111');
      expect(response.name).toBe('My campaign');
      expect(response.color).toBe('#BD3381');
      expect(response.dateRange).not.toBeUndefined();
      expect(response.lastUpdated).toContain('Updated ');
      expect(response.items.length).toBe(1);
    });
  });

  it('fails to get campaign', async () => {
    PublishAPI.get.mockRejectedValueOnce(new Error('Error ocurred'));
    try {
      await getCampaign({ past: false }).then(response => {
        throw new Error(response);
      });
    } catch (err) {
      expect(err.error).toBeUndefined();
      expect(err.message).toEqual('Error ocurred');
    }
  });
});
