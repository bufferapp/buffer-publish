import React from 'react';
import PropTypes from 'prop-types';
import { MediaTypes } from '@bufferapp/publish-constants';
import PersonIcon from '@bufferapp/ui/Icon/Icons/Person';
import { borderRadius } from '@bufferapp/ui/style/borders';
import { Text } from '@bufferapp/ui';
import styled from 'styled-components';
import ComposerActionCreators from '../action-creators/ComposerActionCreators';
import AppActionCreators from '../action-creators/AppActionCreators';
import CloseButton from './CloseButton';
import Button from './Button';
import { escapeParens } from '../utils/StringUtils';
import styles from './css/MediaAttachmentThumbnail.css';
import ModalActionCreators from '../__legacy-buffer-web-shared-components__/modal/actionCreators';

const StyledIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTagWrapper = styled.div`
  position: absolute;
  top: 63%;
  left: 5%;
  color: white;
  display: flex;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: ${borderRadius};
`;

const renderTagOption = tagCount => (
  <StyledTagWrapper>
    <StyledIconWrapper>
      <PersonIcon size="medium" />
    </StyledIconWrapper>
    <Text>
      {tagCount || 'Tag'}
    </Text>
  </StyledTagWrapper>
);

class MediaAttachmentThumbnail extends React.Component {
  static propTypes = {
    draftId: PropTypes.string.isRequired,
    className: PropTypes.string,
    media: PropTypes.object.isRequired,
    showTwitterImageDescription: PropTypes.bool.isRequired,
    composerPosition: PropTypes.object,
    canEditVideoAttachment: PropTypes.bool,
    canAddUserTag: PropTypes.bool,
  };

  static defaultProps = {
    composerPosition: null,
    canEditVideoAttachment: null,
    canAddUserTag: false,
  };

  onClick = () => {
    const {
      media,
      draftId,
      showTwitterImageDescription,
      composerPosition,
      draft,
      canAddUserTag
    } = this.props;

    if (canAddUserTag) {
      ModalActionCreators.openModal('InstagramUserTags', {
        media, draftId, composerPosition, userTags: draft && draft.userTags,
      });
    } else {
      ModalActionCreators.openModal('MediaZoomBox', {
        media, draftId, showTwitterImageDescription, composerPosition,
      });
    }
  }

  onCloseButtonClick = () => {
    const { draftId, media } = this.props;

    switch (media.mediaType) {
      case MediaTypes.IMAGE:
        ComposerActionCreators.removeDraftImage(draftId, media);
        AppActionCreators.trackUserAction(['composer', 'media', 'removed', 'photo'], {
          isGif: false,
        });
        break;

      case MediaTypes.VIDEO:
        ComposerActionCreators.removeDraftVideo(draftId);
        AppActionCreators.trackUserAction(['composer', 'media', 'removed', 'video']);
        break;

      case MediaTypes.GIF:
        ComposerActionCreators.removeDraftGif(draftId);
        AppActionCreators.trackUserAction(['composer', 'media', 'removed', 'photo'], {
          isGif: true,
        });
        break;

      default:
        break;
    }
  };

  render() {
    const {
      media,
      className,
      showTwitterImageDescription,
      canEditVideoAttachment,
      canAddUserTag,
      draft,
    } = this.props;

    const thumbnailClassName = [styles.thumbnail, className].join(' ');
    const isVideo = media.mediaType === MediaTypes.VIDEO;
    const isRegularImage = media.mediaType === MediaTypes.IMAGE;
    const thumbnail = isVideo ? media.thumbnail : media.url;
    const userTagCount = draft.userTags ? draft.userTags.length : null;

    const videoThumbnailClass = canEditVideoAttachment ?
      `${styles.editableVideoThumbnail} bi bi-video` :
      `${styles.videoThumbnail} bi bi-video`;
    const tooltipCopy = (isRegularImage && showTwitterImageDescription) ?
      'Click to expand & add description' : 'Click to expand';
    const ariaLabel = (isRegularImage && showTwitterImageDescription) ?
      'Select to expand image and add image description' :
      `Select to expand ${isVideo ? 'video' : 'image'}`;

    return (
      <div className={thumbnailClassName}>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.imageContainer}
            aria-label={ariaLabel}
            data-tip={tooltipCopy}
            onClick={this.onClick}
          >
            <img
              alt=""
              src={escapeParens(thumbnail)}
              className={styles.thumbnailImage}
            />
            {canAddUserTag &&
              renderTagOption(userTagCount)
            }
            {isVideo &&
              <span className={videoThumbnailClass} aria-label="video attachment" />}
          </Button>
        </div>

        <CloseButton
          className={styles.closeButton}
          onClick={this.onCloseButtonClick}
          label="Remove media"
        />
      </div>
    );
  }
}

export default MediaAttachmentThumbnail;
