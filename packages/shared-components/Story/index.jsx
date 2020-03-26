import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CircleInstReminderIcon } from '@bufferapp/components';
import {
  CoverImage,
  PlayIcon,
} from '@bufferapp/publish-story-group-composer/components/Carousel/CardItem/styles';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';
import { getLargeSafeImageUrl } from '@bufferapp/publish-story-group-composer/utils/SafeImage';
import Card from '../Card';
import CardHeader from '../CardHeader';
import CardFooter from '../CardFooter';
import Carousel, { CarouselCard, getCardSizes } from '../Carousel';
import PostErrorBanner from '../PostErrorBanner';

const sgQueueTranslations = translations['story-group-queue'];

const CardWrapper = styled.div`
  width: ${props => (props.isPastReminder ? '703px' : '100%')};
`;

const Story = ({
  id,
  profileId,
  scheduledAt,
  storyDetails,
  isDeleting,
  isWorking,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onPreviewClick,
  serviceId,
  userData,
  isManager,
  isSent,
  isPastReminder,
}) => {
  const deletingMessage = isDeleting && 'Deleting...';
  const submittingMessage = isWorking && 'Sharing...';
  const actionMessage = deletingMessage || submittingMessage || '';
  const largeCards = false;
  const { cardWidth, cardHeight } = getCardSizes(largeCards);
  const {
    stories,
    avatarUrl,
    createdAt,
    storyAction,
    error,
    errorLink,
  } = storyDetails;
  const { tags } = userData;
  const hasStoriesMobileVersion = tags
    ? tags.includes('has_instagram_stories_mobile')
    : false;

  const hideButtons = !isManager || isSent || isPastReminder;
  const hasError = error && error.length > 0;
  const shouldDisplayErrorBanner = hasError || !hasStoriesMobileVersion;
  const errorMessage = hasError
    ? error
    : sgQueueTranslations.bannerMobileTagText;

  return (
    <CardWrapper isPastReminder={isPastReminder}>
      <Card>
        {shouldDisplayErrorBanner && (
          <PostErrorBanner error={errorMessage} errorLink={errorLink} />
        )}
        <CardHeader
          headerDetails={{
            avatarUrl,
            createdAt,
            onPreviewClick: () => {
              onPreviewClick({
                stories,
                profileId,
                id,
                scheduledAt,
                serviceId,
              });
            },
          }}
        />
        <Carousel
          editMode={false}
          maxItemsPerPage={isPastReminder ? 7 : null}
          totalCardsToShow={(stories && stories.length) || 0}
          totalStories={(stories && stories.length) || 0}
        >
          {stories &&
            stories.map(card => (
              <CarouselCard
                cardHeight={cardHeight}
                cardWidth={cardWidth}
                largeCards={largeCards}
              >
                {card.thumbnail_url && (
                  <CoverImage src={getLargeSafeImageUrl(card.thumbnail_url)} />
                )}
                {card.type === 'video' && <PlayIcon large={false} />}
              </CarouselCard>
            ))}
        </Carousel>
        <CardFooter
          hideButtons={hideButtons}
          icon={hasError ? '' : <CircleInstReminderIcon color="instagram" />}
          onDeleteClick={onDeleteConfirmClick}
          onEditClick={onEditClick}
          onSubmitClick={onShareNowClick}
          isPerformingAction={!!actionMessage}
          actionMessage={actionMessage}
          message={hasError ? '' : storyAction}
          submitLabel={hasError ? 'Retry Now' : 'Share Now'}
        />
      </Card>
    </CardWrapper>
  );
};

Story.propTypes = {
  id: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  scheduledAt: PropTypes.number.isRequired,
  storyDetails: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    storyAction: PropTypes.string.isRequired,
    error: PropTypes.string,
    errorLink: PropTypes.string,
    stories: PropTypes.arrayOf(
      PropTypes.shape({
        order: PropTypes.string,
        note: PropTypes.string,
        asset_url: PropTypes.string,
        thumbnail_url: PropTypes.string,
      })
    ),
  }),
  isDeleting: PropTypes.bool,
  isWorking: PropTypes.bool,
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  onPreviewClick: PropTypes.func,
  serviceId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  isSent: PropTypes.bool,
  isManager: PropTypes.bool,
  isPastReminder: PropTypes.bool,
};

Story.defaultProps = {
  isDeleting: false,
  isWorking: false,
  onDeleteConfirmClick: null,
  onEditClick: null,
  onShareNowClick: null,
  onPreviewClick: null,
  userData: {},
  isManager: true,
  isSent: false,
  isPastReminder: false,
};

export default Story;
