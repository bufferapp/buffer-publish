import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';

import {
  actionTypes as thirdPartyActionTypes,
} from '@bufferapp/publish-thirdparty';
import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';

import middleware from './middleware';
import {
  actions,
  actionTypes as modalsActionTypes,
} from './reducer';

describe('middleware', () => {
  it('should show welcome modal when key is present', () => {
    window._showModal = {
      key: 'welcome-modal-1',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'APP_INIT',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showWelcomeModal());
  });
  it('should show and track modal when key with source is present', () => {
    window._showModal = {
      key: 'upgrade-to-pro--profile_limit',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'APP_INIT',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showSwitchPlanModal({ source: 'profile_limit', plan: 'pro' }));
  });
  it('should send \'unknown\' for key without source', () => {
    window._showModal = {
      key: 'upgrade-to-pro',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'APP_INIT',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showSwitchPlanModal({ source: 'unknown', plan: 'pro' }));
  });
  it('should show and track upgrade modal when triggered from composer', () => {
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'COMPOSER_EVENT',
      eventType: 'show-switch-plan-modal',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showSwitchPlanModal({ source: 'queue_limit', plan: 'pro' }));
  });
  it('should show steal profile modal when key is present', () => {
    window._showModal = {
      key: 'steal-profile-modal',
      value: 'Test Profile',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'APP_INIT',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showStealProfileModal({ stealProfileUsername: 'Test Profile' }));
  });
  it('should show welcome modal to paid users', () => {
    window._showModal = {
      key: 'welcome-modal-2',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'APP_INIT',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showWelcomePaidModal());
  });

  it('should show profiles disconnected modal when one or more is disconnected', () => {
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: `profiles_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: [{ isDisconnected: false }, { isDisconnected: false }, { isDisconnected: true }],
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(actions.showProfilesDisconnectedModal());
  });

  it('should show instagram direct posting modal when key is present', () => {
    window._showModal = {
      key: 'ig-direct-post-modal',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const getState = () => ({
      profileSidebar: {
        selectedProfileId: 'id1',
        selectedProfile: {
          service_type: 'profile',
        },
      },
      thirdparty: {
        appCues: {
          inProgress: false,
        },
      },
    });
    const action = {
      type: profileActionTypes.SELECT_PROFILE,
      profile: {
        id: 'id1',
      },
    };
    const nextAction = {
      name: 'checkInstagramBusiness',
      type: 'FETCH',
      args: {
        profileId: 'id1',
        callbackAction: actions.showInstagramDirectPostingModal({
          profileId: 'id1',
        }),
      },
    };
    middleware({ dispatch, getState })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(nextAction);
  });

  it('should hide instagram direct posting modal if AppCues tour starts', () => {
    window._showModal = {
      key: 'ig-direct-post-modal',
    };
    const next = jest.fn();
    const dispatch = jest.fn();
    const getState = () => ({
      profileSidebar: {
        selectedProfileId: 'id1',
        selectedProfile: {
          service_type: 'profile',
        },
      },
      thirdparty: {
        appCues: {
          inProgress: true,
        },
      },
    });

    const action = {
      type: thirdPartyActionTypes.APPCUES_STARTED,
    };

    const nextAction = {
      type: modalsActionTypes.HIDE_IG_DIRECT_POSTING_MODAL,
    };
    middleware({ dispatch, getState })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(nextAction);
  });

  it('should ignore other actions', () => {
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: 'SOME_OTHER_ACTION',
    };
    middleware({ dispatch })(next)(action);
    expect(next)
      .toBeCalledWith(action);
  });
});
