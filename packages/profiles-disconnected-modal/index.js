import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions } from './reducer';
import ProfilesDisconnectedModal from './components/ProfilesDisconnectedModal';

export default connect(
  state => ({
    translations: state.i18n.translations['profiles-disconnected-modal'],
    profiles: state.ProfileSidebar.profiles,
    ...state.profilesDisconnectedModal,
  }),
  dispatch => ({
    hideModal: () => dispatch(modalsActions.hideProfilesDisconnectedModal()),
    reconnectProfile: (id, service, business) => dispatch(actions.reconnectProfile(id, service, business)),
  }),
)(ProfilesDisconnectedModal);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
