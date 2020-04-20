import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text, Button } from '@bufferapp/ui';
import { fontSize, fontWeightBold } from '@bufferapp/ui/style/fonts';
import { gray, grayDark } from '@bufferapp/ui/style/colors';
import HashtagGroupList from '../HashtagGroupList';

const wrapperStyle = {
  margin: '0 16px',
};

const emptyContentStyle = {
  flex: 1,
  margin: '0 16px',
  textAlign: 'center',
  fontSize,
};

const emptyHeaderStyle = {
  paddingTop: '130px',
  paddingBottom: '8px',
  fontWeight: fontWeightBold,
  color: grayDark,
};

const emptyParagraphStyle = {
  color: gray,
};

const HashtagGroupManager = ({
  onCreateHashtagGroup,
  hashtagGroups,
  onInsertHashtagGroupClick,
  onDeleteHashtagGroupClick,
}) => (
  <Fragment>
    <div style={wrapperStyle}>
      <Text type="h3">Hashtag Manager</Text>
      <Text type="p">Create, save, and organize hashtags for Instagram. </Text>
    </div>
    {hashtagGroups.length === 0 && (
      <div style={emptyContentStyle}>
        <div style={emptyHeaderStyle}>
          <Text>No hashtag groups yet!</Text>
        </div>
        <div style={emptyParagraphStyle}>
          <Text>
            Save and reuse your favorite hashtags by creating a hashtag group.
            Click the button below to get started.
          </Text>
        </div>
      </div>
    )}
    {hashtagGroups.length > 0 && (
      <HashtagGroupList
        hashtagGroups={hashtagGroups}
        onInsertHashtagGroupClick={onInsertHashtagGroupClick}
        onDeleteHashtagGroupClick={onDeleteHashtagGroupClick}
      />
    )}
    <div style={wrapperStyle}>
      <Button
        type="secondary"
        label="Create Hashtag Group"
        fullWidth
        onClick={onCreateHashtagGroup}
      />
    </div>
  </Fragment>
);

HashtagGroupManager.propTypes = {
  onCreateHashtagGroup: PropTypes.func.isRequired,
  hashtagGroups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      id: PropTypes.string,
    })
  ).isRequired,
  onInsertHashtagGroupClick: PropTypes.func.isRequired,
  onDeleteHashtagGroupClick: PropTypes.func.isRequired,
};

export default HashtagGroupManager;
