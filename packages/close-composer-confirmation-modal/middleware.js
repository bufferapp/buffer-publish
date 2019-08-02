import { actions as queueActions } from '@bufferapp/publish-queue';
import { actions as draftsActions } from '@bufferapp/publish-drafts';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actionTypes } from './reducer';

export default ({ dispatch, getState }) => next => (action) => {
  next(action);
  const { tabId } = getState().tabs;

  switch (action.type) {
    case actionTypes.CLOSE_COMPOSER_AND_CONFIRMATION_MODAL:
      switch (tabId) {
        case 'queue':
          dispatch(queueActions.handleComposerCreateSuccess());
          break;
        case 'drafts':
        case 'awaitingApproval':
          dispatch(draftsActions.handleComposerCreateSuccess());
          break;
        default:
          break;
      }
      dispatch(modalsActions.hideCloseComposerConfirmationModal());
      break;
    default:
      break;
  }
};
