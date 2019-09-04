import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions } from './reducer';
import StoryGroupPopover from './components/StoryGroupPopover';

export default connect(
  state => ({
    uses24hTime: state.appSidebar.user.uses_24h_time,
    timezone: state.profileSidebar.selectedProfile.timezone,
    weekStartsMonday: state.appSidebar.user.week_starts_monday,
  }),
  dispatch => ({
    onOverlayClick: () => {
      dispatch(modalsActions.showCloseComposerConfirmationModal());
    },
    onDateTimeSlotPickerSubmit: (timestamp) => {
      dispatch(actions.handleSaveStoryGroup(timestamp));
    },
  }),
)(StoryGroupPopover);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';