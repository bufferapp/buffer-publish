// /* global FS, Appcues */
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';

import middleware from './middleware';

global.FS = {
  identify: jest.fn(),
};

global.Appcues = {
  identify: jest.fn(),
  track: jest.fn(),
  on: jest.fn(),
};

const mockUser = {
  id: 'foo',
  createdAt: 'date',
  plan: 'business',
  planCode: '100',
  trial: {},
  orgUserCount: 2,
  profileCount: 3,
  is_business_user: true,
  tags: [],
};

const mockFreeUser = {
  id: 'bar',
  createdAt: 'date',
  plan: 'free',
  planCode: '100',
  trial: {},
  orgUserCount: 2,
  profileCount: 3,
  is_free_user: true,
  tags: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('middleware', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      productFeatures: { planName: 'business' },
      thirdparty: { appCues: { loaded: true } },
      modals: {},
    }),
  };
  it('always calls next()', () => {
    const action = {
      type: 'TEST',
    };
    middleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('triggers dispatches for third party integrations when the user loads', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: mockUser,
    };
    middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: actionTypes.APPCUES,
      result: mockUser,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: actionTypes.FULLSTORY,
      result: mockUser,
    });
  });
  it('Fullstory does not collect free user data', () => {
    const action = {
      type: actionTypes.FULLSTORY,
      result: mockFreeUser,
    };
    middleware(store)(next)(action);
    expect(global.FS.identify).not.toHaveBeenCalled();
  });
  it('identifies the user with Fullstory', () => {
    const action = {
      type: actionTypes.FULLSTORY,
      result: mockUser,
    };
    middleware(store)(next)(action);
    expect(global.FS.identify).toHaveBeenCalledWith(mockUser.id, {
      pricingPlan_str: 'business',
    });
  });

  it('does not interact with Appcues if user is not business or pro', () => {
    const action = {
      type: actionTypes.APPCUES,
      result: mockFreeUser,
    };
    middleware(store)(next)(action);

    expect(global.Appcues.identify).not.toHaveBeenCalled();
    expect(global.Appcues.on).not.toHaveBeenCalled();
  });

  it('marks Appcues as loaded and identifies a B4B / Pro user with Appcues', () => {
    const action = {
      type: actionTypes.APPCUES,
      result: mockUser,
    };
    middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: actionTypes.APPCUES_LOADED,
      loaded: true,
    });
    expect(global.Appcues.identify).toHaveBeenCalledWith(mockUser.id, {
      name: mockUser.id,
      modalsShowing: false,
      createdAt: mockUser.createdAt,
      plan: mockUser.plan,
      planCode: mockUser.planCode,
      onTrial: mockUser.trial.onTrial,
      trialLength: mockUser.trial.trialLength,
      trialTimeRemaining: mockUser.trial.trialTimeRemaining,
      orgUserCount: mockUser.orgUserCount,
      profileCount: mockUser.profileCount,
      upgradedFromLegacyAwesomeToProPromotion: false,
      migratedFromAwesomeToPro_Batch1: false,
      migratedFromAwesomeToPro_teamMember_Batch1: false,
    });

    expect(global.Appcues.on.mock.calls).toEqual([
      ['flow_started', expect.any(Function)],
      ['flow_completed', expect.any(Function)],
      ['flow_skipped', expect.any(Function)],
      ['flow_aborted', expect.any(Function)],
    ]);
  });

  it('tells AppCues when the user has upgraded from legacy awesome to Pro', () => {
    const action = {
      type: actionTypes.APPCUES,
      result: { ...mockUser, tags: ['upgraded-to-pro-from-legacy-awesome'] },
    };
    middleware(store)(next)(action);
    expect(global.Appcues.identify).toHaveBeenCalledWith(mockUser.id, {
      name: mockUser.id,
      modalsShowing: false,
      createdAt: mockUser.createdAt,
      plan: mockUser.plan,
      planCode: mockUser.planCode,
      onTrial: mockUser.trial.onTrial,
      trialLength: mockUser.trial.trialLength,
      trialTimeRemaining: mockUser.trial.trialTimeRemaining,
      orgUserCount: mockUser.orgUserCount,
      profileCount: mockUser.profileCount,
      upgradedFromLegacyAwesomeToProPromotion: true,
      migratedFromAwesomeToPro_Batch1: false,
      migratedFromAwesomeToPro_teamMember_Batch1: false,
    });
  });

  it('tells AppCues when the user has been migrated from legacy awesome to Pro', () => {
    const action = {
      type: actionTypes.APPCUES,
      result: { ...mockUser, tags: ['awesome-pro-forced-migration'] },
    };
    middleware(store)(next)(action);
    expect(global.Appcues.identify).toHaveBeenCalledWith(mockUser.id, {
      name: mockUser.id,
      modalsShowing: false,
      createdAt: mockUser.createdAt,
      plan: mockUser.plan,
      planCode: mockUser.planCode,
      onTrial: mockUser.trial.onTrial,
      trialLength: mockUser.trial.trialLength,
      trialTimeRemaining: mockUser.trial.trialTimeRemaining,
      orgUserCount: mockUser.orgUserCount,
      profileCount: mockUser.profileCount,
      upgradedFromLegacyAwesomeToProPromotion: false,
      migratedFromAwesomeToPro_Batch1: true,
      migratedFromAwesomeToPro_teamMember_Batch1: false,
    });
  });

  it('tells AppCues when a users team member has been migrated from legacy awesome to Pro', () => {
    const action = {
      type: actionTypes.APPCUES,
      result: {
        ...mockUser,
        tags: ['awesome-pro-forced-migration-team-member'],
      },
    };
    middleware(store)(next)(action);
    expect(global.Appcues.identify).toHaveBeenCalledWith(mockUser.id, {
      name: mockUser.id,
      modalsShowing: false,
      createdAt: mockUser.createdAt,
      plan: mockUser.plan,
      planCode: mockUser.planCode,
      onTrial: mockUser.trial.onTrial,
      trialLength: mockUser.trial.trialLength,
      trialTimeRemaining: mockUser.trial.trialTimeRemaining,
      orgUserCount: mockUser.orgUserCount,
      profileCount: mockUser.profileCount,
      upgradedFromLegacyAwesomeToProPromotion: false,
      migratedFromAwesomeToPro_Batch1: false,
      migratedFromAwesomeToPro_teamMember_Batch1: true,
    });
  });

  it('sends event to appcues when user adds a post in the composer', () => {
    const action = {
      type: 'COMPOSER_EVENT',
      eventType: 'saved-drafts',
    };
    middleware(store)(next)(action);
    expect(global.Appcues.track).toHaveBeenCalledWith('Created Post');
  });
});
