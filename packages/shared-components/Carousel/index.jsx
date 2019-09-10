import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash.clamp';
import { grayLighter } from '@bufferapp/ui/style/colors';
import ArrowLeft from '@bufferapp/ui/Icon/Icons/ArrowLeft';
import ArrowRight from '@bufferapp/ui/Icon/Icons/ArrowRight';
import { CirclePlayIcon } from '@bufferapp/components/Icon/Icons';

import UploadZone from '@bufferapp/publish-upload-zone';
import { Button } from '@bufferapp/ui';
import Attach from '@bufferapp/ui/Icon/Icons/Attach';
import FileUploader from '@bufferapp/publish-composer/composer/file-uploads/FileUploader';
import { UploadTypes } from '@bufferapp/publish-constants';
import { FileUploadFormatsConfigs } from '@bufferapp/publish-composer/composer/AppConstants';
import * as Styles from './style';

const lowerBounds = 0;

const getCardSizes = (editMode) => {
  if (editMode) {
    return { cardWidth: 180, cardHeight: 320, maxPerPage: 4 };
  }

  return { cardWidth: 110, cardHeight: 198, maxPerPage: 7 };
};

const sortCards = cards => (
  cards.sort((a, b) => {
    if (a.order > b.order) return 1;
    return -1;
  })
);

const getCardsToShow = ({ cards = [], cardsToShow }) => {
  const cardList = [];
  const sortedCards = sortCards(cards);
  for (let i = 0, firstEmpty = true; i < cardsToShow; i += 1) {
    const card = sortedCards[i];
    if (card) {
      cardList.push(card);
    } else {
      cardList.push({
        order: `${i}`,
        empty: firstEmpty,
      });
      firstEmpty = false;
    }
  }
  return cardList;
};

const NavArrow = ({
  prev = false,
  hide = false,
  incrementBy = 1,
  selectedItem = 0,
  setSelectedItem = null,
  cardsToShow,
}) => {
  if (hide) return null;
  const lowerBounds = 0;
  const upperBounds = cardsToShow - 1;

  return (
    <Styles.Arrow
      prev={prev}
      onClick={() => {
        setSelectedItem(clamp(selectedItem + incrementBy, lowerBounds, upperBounds));
      }}
    >
      {prev ? <ArrowLeft /> : <ArrowRight />}
    </Styles.Arrow>
  );
};

const PlayIcon = () => (
  <Styles.IconWrapper>
    <CirclePlayIcon color={grayLighter} size={{ width: '40px' }} />
  </Styles.IconWrapper>
);

/**
 * Carousel on view mode, to display images in the queue
 * Carousel on edit mode, handling from the composer
 */
class CarouselBody extends React.Component {
  notifiers = {
    uploadStarted: ({ id, uploaderInstance, file }) => {
      console.log('uploadStarted', { id, uploaderInstance, file });
    },
    uploadedLinkThumbnail: ({
      id,
      uploaderInstance,
      url,
      width,
      height,
      file,
    }) => {
      console.log('uploadedLinkThumbnail', {
        id, uploaderInstance, url, width, height, file,
      });
    },
    uploadedDraftImage: ({
      id,
      uploaderInstance,
      url,
      location,
      width,
      height,
      file,
    }) => {
      console.log('uploadedDraftImage', {
        id, uploaderInstance, url, location, width, height, file,
      });
    },
    uploadedDraftVideo: ({
      id,
      uploaderInstance,
      uploadId,
      fileExtension,
      file,
    }) => {
      console.log('uploadedDraftVideo', {
        id, uploaderInstance, uploadId, fileExtension, file,
      });
    },
    draftGifUploaded: ({
      id,
      uploaderInstance,
      url,
      stillGifUrl,
      width,
      height,
      file,
    }) => {
      console.log('draftGifUploaded', {
        id, uploaderInstance, url, stillGifUrl, width, height, file,
      });
    },
    queueError: ({ message }) => {
      console.log('queueError', { message });
    },
    monitorFileUploadProgress: async ({ id, uploaderInstance, file }) => {
      const progressIterator = uploaderInstance.getProgressIterator();
      let item;

      while (!(item = progressIterator.next()).done) { // eslint-disable-line no-cond-assign
        const promisedProgress = item.value;

        await promisedProgress.then((progress) => { // eslint-disable-line no-await-in-loop
          console.log('monitorFileUploadProgress', {
            id, uploaderInstance, progress, file,
          });
        });
      }
      console.log('monitorFileUploadProgress', { id, uploaderInstance, file });
    },
  };

  uploadDraftFile = (id, file, uploadType, notifiers, createFileUploaderCallback) => {
    const { userData } = this.props;
    const {
      id: userId,
      s3_upload_signature: s3Signature,
      imageDimensionsKey,
    } = userData;

    const s3UploadSignature = {
      algorithm: s3Signature.algorithm,
      base64Policy: s3Signature.base64policy,
      bucket: s3Signature.bucket,
      credentials: s3Signature.credentials,
      date: s3Signature.date,
      expires: s3Signature.expires,
      signature: s3Signature.signature,
      successActionStatus: s3Signature.success_action_status,
    };
    const uploadDraftFileCallback = createFileUploaderCallback({
      s3UploadSignature,
      userId,
      csrfToken: null,
      imageDimensionsKey,
      serverNotifiers: {
        videoProcessed: (processedVideoData) => {
          const {
            uploadId,
            name,
            duration,
            durationMs,
            size,
            width,
            height,
            url,
            originalUrl,
            thumbnail,
            availableThumbnails,
          } = processedVideoData;

          // trigger this when a video has completed being processed on the server
          console.log('videoProcessed', {
            processedVideoData: {
              uploadId,
              name,
              duration,
              durationMs,
              size,
              width,
              height,
              url,
              originalUrl,
              thumbnail,
              availableThumbnails,
            },
          });
        },
        profileGroupCreated: () => {},
        profileGroupUpdated: () => {},
        profileGroupDeleted: () => {},
      },
    });

    return uploadDraftFileCallback(id, file, uploadType, notifiers);
  };


  render () {
    const {
      cards,
      editMode,
      cardsToShow,
    } = this.props;
    const { cardWidth, cardHeight } = getCardSizes(editMode);
    const cardsToRender = editMode ? getCardsToShow({ cards, cardsToShow }) : sortCards(cards);
    const uploadFormatsConfig = new Map(FileUploadFormatsConfigs.MEDIA); // Clone config

    return cardsToRender.map(card => (
      <Styles.CarouselCard
        key={card.order}
        card={card}
        cardHeight={cardHeight}
        cardWidth={cardWidth}
        editMode={editMode}
      >
        {editMode
          ? (
            <React.Fragment>
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
                    supportsMixedMediaTypes
                    mixedMediaUnsupportedCallback={FileUploader.throwMixedMediaTypesError}
                    uploadDraftFile={this.uploadDraftFile}
                    notifiers={this.notifiers}
                    removeAllNotifications={() => console.log('removeAllNotifications', true)}
                    queueError={({ message }) => console.log('queueError', { message })}
                    draftId={card.order}
                    uploadFormatsConfig={uploadFormatsConfig}
                    service={{
                      maxAttachableImagesCount: cardsToShow,
                      canHaveMediaAttachmentType: () => true,
                    }}
                    uploadType={UploadTypes.LINK_THUMBNAIL}
                    multiple
                    disabled={false}
                  />
                </div>
              )}

            </React.Fragment>
          )
          : card.type === 'video' && <PlayIcon />
        }
      </Styles.CarouselCard>
    ));
  }
}

const shouldHideRightArrow = (
  total,
  selectedItem,
  maxPerPage,
) => total - selectedItem - maxPerPage < 0;

class Carousel extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedItem: props.initialSelectedItem || 0,
    };
  }

  setSelectedItem = (item) => {
    this.setState({
      selectedItem: item,
    });
  };

  render () {
    const {
      cards,
      editMode,
      cardsToShow,
      userData,
    } = this.props;

    const { selectedItem } = this.state;
    const { cardWidth, cardHeight, maxPerPage } = getCardSizes(editMode);
    const total = editMode ? cardsToShow : cards.length;

    return (
      <React.Fragment>
        <Styles.SliderCarousel
          editMode={editMode}
        >
          <Styles.CarouselContainer
            selectedItem={selectedItem}
            totalCards={total}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            editMode={editMode}
          >
            <CarouselBody
              cards={cards}
              editMode={editMode}
              cardsToShow={cardsToShow}
              userData={userData}
            />
          </Styles.CarouselContainer>
          <NavArrow
            prev
            hide={selectedItem <= 0}
            setSelectedItem={this.setSelectedItem}
            selectedItem={selectedItem}
            incrementBy={-1}
            cardsToShow={total}
          />
          <NavArrow
            hide={shouldHideRightArrow(total, selectedItem, maxPerPage)}
            setSelectedItem={this.setSelectedItem}
            selectedItem={selectedItem}
            incrementBy={+1}
            cardsToShow={total}
          />
        </Styles.SliderCarousel>
      </React.Fragment>
    );
  }
}

Carousel.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.string,
    type: PropTypes.string,
    note: PropTypes.string,
    asset_url: PropTypes.string,
    thumbnail_url: PropTypes.string,
  })),
  editMode: PropTypes.bool,
  initialSelectedItem: PropTypes.number,
  userData: PropTypes.shape({
    id: PropTypes.string,
    s3_upload_signature: PropTypes.shape({
      algorithm: PropTypes.string,
      base64Policy: PropTypes.string,
      bucket: PropTypes.string,
      credentials: PropTypes.string,
      date: PropTypes.string,
      expires: PropTypes.string,
      signature: PropTypes.string,
      success_action_status: PropTypes.string,
    }).isRequired,
    imageDimensionsKey: PropTypes.string,
  }).isRequired,
};

NavArrow.propTypes = {
  prev: PropTypes.bool,
  hide: PropTypes.bool,
  incrementBy: PropTypes.number,
  selectedItem: PropTypes.number,
  setSelectedItem: PropTypes.func,
  upperBounds: PropTypes.number,
};

Carousel.defaultProps = {
  cards: [],
  editMode: false,
  initialSelectedItem: 0,
  cardsToShow: 15,
};

export default Carousel;
