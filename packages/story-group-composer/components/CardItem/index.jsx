import React, { useState } from 'react';
import { CarouselCard } from '@bufferapp/publish-shared-components/Carousel';
import { Text, LoadingAnimation } from '@bufferapp/components';
import UploadZone from '@bufferapp/publish-upload-zone';
import { Button } from '@bufferapp/ui';
import Attach from '@bufferapp/ui/Icon/Icons/Attach';
import FileUploader from '@bufferapp/publish-composer/composer/file-uploads/FileUploader';
import { UploadTypes } from '@bufferapp/publish-constants';
import CircularUploadIndicator
  from '@bufferapp/publish-composer/composer/components/progress-indicators/CircularUploadIndicator';
import PropTypes from 'prop-types';
import CarouselCardHover from '../Carousel/CarouselCardHover';
import styles from './styles.css';

import { CoverImage, UploadingVideo, StoryWrapper } from './styles';

const CardItem = ({
  card,
  cardHeight,
  cardWidth,
  userData,
  largeCards,
  uploadFormatsConfig,
  maxAttachableMediaCount,
  removeNotifications,
  notifyError,
  videoProcessingComplete,
  uploadDraftFile,
  updateUploadProgress,
  monitorUpdateProgress,
  createNewFile,
  createImageThumbnail,
  uploadImageComplete,
  videoProcessingStarted,
  onAddNoteClick,
  onDeleteStoryClick,
}) => {
  const notifiers = {
    uploadStarted: props => createNewFile(props),
    uploadedLinkThumbnail: props => createImageThumbnail(props),
    uploadedDraftImage: props => uploadImageComplete({ ...props, contentType: 'image' }),
    uploadedDraftVideo: props => videoProcessingStarted({ ...props, contentType: 'video' }),
    draftGifUploaded: props => uploadImageComplete({ ...props, contentType: 'gif' }),
    queueError: props => notifyError(props),
    monitorFileUploadProgress: monitorUpdateProgress(updateUploadProgress),
  };
  const [isHovering, setIsHovering] = useState(false);

  return (
    <CarouselCard
      key={card.uploadTrackingId}
      card={card}
      cardHeight={cardHeight}
      cardWidth={cardWidth}
      largeCards={largeCards}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {card.empty && (
      <div>
        <UploadZone
          uploadButton={({ onClick }) => (
            <Button
              type="primary"
              label="Add Media Files"
              icon={<Attach />}
              onClick={onClick}
            />
          )}
          classNames={styles}
          supportsMixedMediaTypes
          mixedMediaUnsupportedCallback={FileUploader.throwMixedMediaTypesError}
          uploadDraftFile={uploadDraftFile({ userData, videoProcessingComplete })}
          notifiers={notifiers}
          removeAllNotifications={removeNotifications}
          queueError={notifyError}
          draftId={`${card.order}`}
          uploadFormatsConfig={uploadFormatsConfig}
          service={{
            maxAttachableImagesCount: maxAttachableMediaCount,
            canHaveMediaAttachmentType: () => true,
          }}
          uploadType={UploadTypes.MEDIA}
          multiple
          disabled={false}
        />
      </div>
      )}
      {!card.empty && card.progress !== null && card.uploading && (
      <CircularUploadIndicator
        classNames={{ container: styles.container }}
        size={54}
        progress={card.progress}
        showText
        finishingUpText="Finishing Upload..."
      />
      )}

      {card.thumbnail_url && (
        <StoryWrapper>
          <CoverImage src={card.thumbnail_url} />
          {isHovering && (
            <CarouselCardHover
              card={card}
              onAddNoteClick={onAddNoteClick}
              onDeleteStoryClick={onDeleteStoryClick}
            />
          )}
        </StoryWrapper>
      )}

      {!card.empty && card.processing === true && (
      <UploadingVideo>
        <Text size="small">Processing video</Text>
        <LoadingAnimation marginTop="0" />
      </UploadingVideo>
      )}
    </CarouselCard>
  );
};

CardItem.propTypes = {
  card: PropTypes.shape({
    order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    note: PropTypes.string,
    asset_url: PropTypes.string,
    thumbnail_url: PropTypes.string,
  }),
};

CardItem.defaultProps = {
  card: {},
};

export default CardItem;
