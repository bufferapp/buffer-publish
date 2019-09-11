import { connect } from 'react-redux';
import PreviewPopover from './components/PreviewPopover';

export default connect(
  state => ({
    user: state.storyPreview.user,
    stories: state.storyPreview.stories,
  }),
  dispatch => ({
    onOverlayClick: () => {
    },
    onSaveNoteClick: ({ note, storyId }) => {
      //dispatch(actions.handleSaveStoryNote({ note, storyId }));
    },
  }),
)(PreviewPopover);

export reducer, { actions, actionTypes } from './reducer';
// export middleware from './middleware';
