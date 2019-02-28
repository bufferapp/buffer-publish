import reducer, { initialState, actions } from './reducer';

describe('reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'INIT' };
    expect(reducer(undefined, action))
      .toEqual(initialState);
  });

  describe('actions', () => {
    it('should show upgrade modal', () => {
      expect(reducer(initialState, actions.showUpgradeModal({ source: 'foo' })))
        .toEqual(Object.assign(initialState, { showUpgradeModal: true, upgradeModalSource: 'foo' }));
    });
    it('should hide upgrade modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showUpgradeModal: true, upgradeModalSource: 'foo' },
      );
      expect(reducer(stateWithVisibleModal, actions.hideUpgradeModal()))
        .toEqual(Object.assign(initialState, { showUpgradeModal: false, upgradeModalSource: 'foo' }));
    });
    it('should show welcome modal', () => {
      expect(reducer(initialState, actions.showWelcomeModal()))
        .toEqual(Object.assign(initialState, { showWelcomeModal: true }));
    });
    it('should hide welcome modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showWelcomeModal: true },
      );
      expect(reducer(stateWithVisibleModal, actions.hideWelcomeModal()))
        .toEqual(Object.assign(initialState, { showWelcomeModal: false }));
    });
    it('should show steal profile modal', () => {
      expect(reducer(initialState, actions.showStealProfileModal({ stealProfileUsername: 'foo' })))
        .toEqual(Object.assign(initialState, { showStealProfileModal: true, stealProfileUsername: 'foo' }));
    });
    it('should hide steal profile modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showStealProfileModal: true, stealProfileUsername: 'foo' },
      );
      expect(reducer(stateWithVisibleModal, actions.hideStealProfileModal()))
        .toEqual(Object.assign(initialState, { showStealProfileModal: false }));
    });
    it('should show welcome b4b trial modal', () => {
      expect(reducer(initialState, actions.showWelcomeB4BTrialModal()))
        .toEqual(Object.assign(initialState, { showWelcomeB4BTrialModal: true }));
    });
    it('should hide welcome b4b trial modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showWelcomeB4BTrialModal: true },
      );
      expect(reducer(stateWithVisibleModal, actions.hideWelcomeB4BTrialModal()))
        .toEqual(Object.assign(initialState, { showWelcomeB4BTrialModal: false }));
    });
    it('should show profiles disconnected modal', () => {
      expect(reducer(initialState, actions.showProfilesDisconnectedModal()))
        .toEqual(Object.assign(initialState, { showProfilesDisconnectedModal: true }));
    });
    it('should hide profiles disconnected modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showProfilesDisconnectedModal: true },
      );
      expect(reducer(stateWithVisibleModal, actions.hideProfilesDisconnectedModal()))
        .toEqual(Object.assign(initialState, { showProfilesDisconnectedModal: false }));
    });
    it('should show welcome paid modal', () => {
      expect(reducer(initialState, actions.showWelcomePaidModal()))
        .toEqual(Object.assign(initialState, { showWelcomePaidModal: true }));
    });
    it('should hide welcome paid modal', () => {
      const stateWithVisibleModal = Object.assign(
        initialState,
        { showWelcomePaidModal: true },
      );
      expect(reducer(stateWithVisibleModal, actions.hideWelcomePaidModal()))
        .toEqual(Object.assign(initialState, { showWelcomePaidModal: false }));
    });
  });
});
