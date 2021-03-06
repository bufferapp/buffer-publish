import reducer, { initialState, actions } from './reducer';

describe('Modals | reducer', () => {
  it('should return initial state', () => {
    const action = { type: 'INIT' };
    expect(reducer(undefined, action)).toEqual(initialState);
  });

  describe('actions', () => {
    it('should show upgrade modal', () => {
      expect(
        reducer(initialState, actions.showSwitchPlanModal({ source: 'foo' }))
      ).toEqual(
        Object.assign(initialState, {
          showSwitchPlanModal: true,
          switchPlanModalSource: 'foo',
        })
      );
    });
    it('should hide upgrade modal', () => {
      const stateWithVisibleModal = Object.assign(initialState, {
        showSwitchPlanModal: true,
        switchPlanModalSource: 'foo',
      });
      expect(
        reducer(stateWithVisibleModal, actions.hideUpgradeModal())
      ).toEqual(
        Object.assign(initialState, {
          showSwitchPlanModal: false,
          switchPlanModalSource: 'foo',
        })
      );
    });
    it('should show steal profile modal', () => {
      expect(
        reducer(
          initialState,
          actions.showStealProfileModal({ stealProfileUsername: 'foo' })
        )
      ).toEqual(
        Object.assign(initialState, {
          showStealProfileModal: true,
          stealProfileUsername: 'foo',
        })
      );
    });
    it('should hide steal profile modal', () => {
      const stateWithVisibleModal = Object.assign(initialState, {
        showStealProfileModal: true,
        stealProfileUsername: 'foo',
      });
      expect(
        reducer(stateWithVisibleModal, actions.hideStealProfileModal())
      ).toEqual(Object.assign(initialState, { showStealProfileModal: false }));
    });
    it('should show profiles disconnected modal', () => {
      expect(
        reducer(initialState, actions.showProfilesDisconnectedModal())
      ).toEqual(
        Object.assign(initialState, { showProfilesDisconnectedModal: true })
      );
    });
    it('should hide profiles disconnected modal', () => {
      const stateWithVisibleModal = Object.assign(initialState, {
        showProfilesDisconnectedModal: true,
      });
      expect(
        reducer(stateWithVisibleModal, actions.hideProfilesDisconnectedModal())
      ).toEqual(
        Object.assign(initialState, { showProfilesDisconnectedModal: false })
      );
    });
    it('should show instagram first comment start trial modal', () => {
      expect(
        reducer(
          initialState,
          actions.showInstagramFirstCommentProTrialModal({ source: 'foo' })
        )
      ).toEqual(
        Object.assign(initialState, {
          showInstagramFirstCommentProTrialModal: true,
        })
      );
    });
    it('should hide instagram first comment start trial modal', () => {
      const stateWithVisibleModal = Object.assign(initialState, {
        showInstagramFirstCommentProTrialModal: true,
      });
      expect(
        reducer(
          stateWithVisibleModal,
          actions.hideInstagramFirstCommentProTrialModal()
        )
      ).toEqual(
        Object.assign(initialState, {
          showInstagramFirstCommentProTrialModal: false,
        })
      );
    });
    it('should show close composer confirmation modal', () => {
      expect(
        reducer(
          initialState,
          actions.showCloseComposerConfirmationModal({ page: 'queue' })
        )
      ).toEqual(
        Object.assign(initialState, {
          showCloseComposerConfirmationModal: true,
        })
      );
    });
    it('should hide close composer confirmation modal', () => {
      expect(
        reducer(initialState, actions.hideCloseComposerConfirmationModal())
      ).toEqual(
        Object.assign(initialState, {
          showCloseComposerConfirmationModal: false,
        })
      );
    });
    it('should show instagram first comment modal', () => {
      expect(
        reducer(
          initialState,
          actions.showInstagramFirstCommentModal({ ids: 'ids' })
        )
      ).toEqual(
        Object.assign(initialState, {
          showInstagramFirstCommentModal: true,
          firstCommentIds: 'ids',
        })
      );
    });
    it('should hide instagram first comment modal', () => {
      expect(
        reducer(initialState, actions.hideInstagramFirstCommentModal())
      ).toEqual(
        Object.assign(initialState, {
          showInstagramFirstCommentModal: false,
          firstCommentIds: null,
        })
      );
    });
    it('should show trial complete modal', () => {
      expect(reducer(initialState, actions.showTrialCompleteModal())).toEqual(
        Object.assign(initialState, { showTrialCompleteModal: true })
      );
    });
    it('should hide trial complete modal', () => {
      expect(reducer(initialState, actions.hideTrialCompleteModal())).toEqual(
        Object.assign(initialState, { showTrialCompleteModal: false })
      );
    });
    it('should save modal to show later', () => {
      expect(
        reducer(
          initialState,
          actions.saveModalToShowLater({
            modalId: 'modalId',
            profileId: 'profileId',
          })
        )
      ).toEqual(
        Object.assign(initialState, {
          modalToShowLater: {
            id: 'modalId',
            params: {
              profileId: 'profileId',
            },
          },
        })
      );
    });
  });
});
