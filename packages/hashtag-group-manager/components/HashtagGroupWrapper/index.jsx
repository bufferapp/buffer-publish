import React from 'react';
import PropTypes from 'prop-types';
import HashtagGroupCreator from './../HashtagGroupCreator';
import HashtagGroupManager from './../HashtagGroupManager';

const boxStyle = {
  height: 'calc(100% - 16px)',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 0 16px',
};

const CREATE_MODE = 'createHashtag';
const MANAGE_MODE = 'manageHashtag';

class HashtagGroupWrapper extends React.Component {
  constructor () {
    super();

    this.state = {
      viewMode: CREATE_MODE,
    };

    this.onSwitchMode = this.onSwitchMode.bind(this);
    // this.onSaveHashtagGroup = this.onSaveHashtagGroup.bind(this);
    this.onDeleteHashtagGroupClick = this.onDeleteHashtagGroupClick.bind(this);
  }

  componentDidMount() {
    this.onSwitchMode(this.props.viewMode);
  }

  onSwitchMode(viewMode) {
    this.setState({ viewMode });
  }

  // @todo: create implementation for save group
  /*
  onSaveHashtagGroup() {
    const { name, text } = this.props;
    this.props.onSaveHashtagGroup(name, text);
  }
*/
  // @todo: create implementation for delete group
  onDeleteHashtagGroupClick() {
    console.log('Delete Hashtag Group');
  }

  render() {
    const { viewMode } = this.state;
    const {
      hashtagGroups,
      onInsertHashtagGroupClick,
      name,
      text,
      onChangeGroupName,
      onChangeGroupText,
      onSaveHashtagGroup,
    } = this.props;

    return (
      <div style={boxStyle}>
        {viewMode === CREATE_MODE &&
          <HashtagGroupCreator
            name={name}
            text={text}
            onChangeGroupName={onChangeGroupName}
            onChangeGroupText={onChangeGroupText}
            onSaveHashtagGroup={onSaveHashtagGroup}
            onCancelHashtagGroup={() => this.onSwitchMode(MANAGE_MODE)}
          />
        }
        {viewMode === MANAGE_MODE &&
          <HashtagGroupManager
            hashtagGroups={hashtagGroups}
            onCreateHashtagGroup={() => this.onSwitchMode(CREATE_MODE)}
            onInsertHashtagGroupClick={onInsertHashtagGroupClick}
            onDeleteHashtagGroupClick={() => this.onDeleteHashtagGroupClick()}
          />
        }
      </div>
    );
  }
}

HashtagGroupWrapper.propTypes = {
  viewMode: PropTypes.string,
  name: PropTypes.string,
  text: PropTypes.string,
  onInsertHashtagGroupClick: PropTypes.func,
  onSaveHashtagGroup: PropTypes.func,
  onChangeGroupName: PropTypes.func,
  onChangeGroupText: PropTypes.func,
  hashtagGroups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      id: PropTypes.string,
    }),
  ).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    canPostComment: PropTypes.bool,
    isSelected: PropTypes.bool,
  })),
};

HashtagGroupWrapper.defaultProps = {
  viewMode: 'createHashtag',
  name: null,
  text: '',
  hashtagGroups: [],
  profiles: null,
  onInsertHashtagGroupClick: () => {},
  onSaveHashtagGroup: () => {},
  onChangeGroupName: () => {},
  onChangeGroupText: () => {},
};

export default HashtagGroupWrapper;
