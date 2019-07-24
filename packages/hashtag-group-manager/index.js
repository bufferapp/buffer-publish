import { connect } from 'react-redux';
import HashtagGroupWrapper from './components/HashtagGroupWrapper';
import { actions } from './reducer';

export default connect(
  state => ({
    hashtagGroups: state.hashtagGroups.groups,
    name: state.hashtagGroups.name,
    text: state.hashtagGroups.text,
    organizationId: state.profileSidebar.selectedProfile.organizationId,
  }),
  (dispatch, ownProps) => ({
    onCancelHashtagGroup: () => {
      dispatch(actions.handleCancelHashtagGroupClick());
    },
    onSaveHashtagGroup: () => {
      dispatch(actions.handleSaveHashtagGroupClick());
    },
    onDeleteHashtagGroup: (groupId) => {
      dispatch(actions.handleDeleteHashtagGroup({
        groupId,
      }));
    },
    onChangeGroupName: (name) => {
      dispatch(actions.handleChangeGroupName({
        name,
      }));
    },
    onChangeGroupText: (text) => {
      dispatch(actions.handleChangeGroupText({
        text,
      }));
    },
    onHandleInsertHashtagGroupClick: (text) => {
      if (ownProps.onInsertHashtagGroupClick) {
        ownProps.onInsertHashtagGroupClick(text);
      }
      dispatch(actions.handleInsertHashtagGroupClick());
    },
  }),
)(HashtagGroupWrapper);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
