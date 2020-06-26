import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';

import reducer, { initialState } from './reducer';

describe('reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'INIT' };
    expect(reducer(undefined, action)).toEqual(initialState);
  });

  it('should set showReturnToClassic when the user is loaded', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { showReturnToClassic: true },
    };
    expect(reducer(undefined, action).showReturnToClassic).toBe(true);
  });

  it('should set showStartProTrial to true for users with canStartProTrial set to true that are not team members', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { canStartProTrial: true, isBusinessTeamMember: false },
    };
    expect(reducer(undefined, action).showStartProTrial).toBe(true);
  });

  it('should set showStartProTrial to false for users with canStartProTrial set to true that are team members', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { canStartProTrial: true, isBusinessTeamMember: true },
    };
    expect(reducer(undefined, action).showStartProTrial).toBe(false);
  });

  it('should set showSwitchPlanModal to true for free users', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { is_free_user: true, isBusinessTeamMember: false },
    };
    expect(reducer(undefined, action).showSwitchPlanModal).toBe(true);
  });

  it('should set showSwitchPlanModal to false for free users that are business team members', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { is_free_user: true, isBusinessTeamMember: true },
    };
    expect(reducer(undefined, action).showSwitchPlanModal).toBe(false);
  });

  it('should collect the user data when the user is loaded', () => {
    const action = {
      type: `user_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { email: 'foo@wow.com', name: 'Carlton', ignoredData: 'foobar' },
    };
    expect(reducer(undefined, action).user).toEqual({
      email: 'foo@wow.com',
      name: 'Carlton',
    });
  });

  it('should set isImpersonation to true during an impersonation session', () => {
    const action = {
      type: `globalAccount_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { id: '0123456789', email: 'foo@wow.com', isImpersonation: true },
    };
    expect(reducer(undefined, action).isImpersonation).toBe(true);
  });
});
