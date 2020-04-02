import { actions as queueActions } from '@bufferapp/publish-queue/reducer';
import { actions as draftsActions } from '@bufferapp/publish-drafts/reducer';
import { actions as modalsActions } from '@bufferapp/publish-modals/reducer';
import { actions as storiesActions } from '@bufferapp/publish-stories/reducer';
import { actions as remindersActions } from '@bufferapp/publish-past-reminders/reducer';
import { actions as campaignsActions } from '@bufferapp/publish-campaign/reducer';
import { actions as storyGroupComposerActions } from '@bufferapp/publish-story-group-composer/reducer';
import { actionTypes } from './reducer';

export default ({ dispatch, getState }) => next => action => {
  next(action);
  const { page } = getState().modals;

  switch (action.type) {
    case actionTypes.CLOSE_COMPOSER_AND_CONFIRMATION_MODAL:
      switch (page) {
        case 'stories':
          dispatch(storyGroupComposerActions.resetStoryGroupState());
          dispatch(storiesActions.handleCloseStoriesComposer());
          break;
        case 'pastReminders':
          dispatch(storyGroupComposerActions.resetStoryGroupState());
          dispatch(remindersActions.handleCloseStoriesComposer());
          break;
        case 'queue':
          dispatch(queueActions.handleComposerCreateSuccess());
          break;
        case 'drafts':
        case 'awaitingApproval':
          dispatch(draftsActions.handleComposerCreateSuccess());
          break;
        case 'campaigns':
          dispatch(campaignsActions.handleCloseComposer());
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
