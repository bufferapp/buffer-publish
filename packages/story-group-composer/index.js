import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as previewActions } from '@bufferapp/publish-story-preview';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import getCtaProperties from '@bufferapp/publish-analytics-middleware/utils/CtaStrings';
import uuid from 'uuid/v4';
import { getCounts } from './utils/Tracking';
import { actions } from './reducer';
import StoryGroupPopover from './components/StoryGroupPopover';

export default connect(
  (state, ownProps) => {
    const { emptySlotData = {} } = state.stories;
    const { type } = ownProps;
    const { editingPostId } = state[type];
    let options = {};

    if (type === 'pastReminders') {
      options = {
        sentPost: true,
      };
    }

    return {
      uses24hTime: state.appSidebar.user.uses_24h_time,
      timezone: state.profileSidebar.selectedProfile.timezone,
      weekStartsMonday: state.appSidebar.user.week_starts_monday,
      selectedProfile: state.profileSidebar.selectedProfile,
      translations: state.i18n.translations['story-group-composer'],
      isScheduleLoading: state.storyGroupComposer.isScheduleLoading,
      storyGroup: state.storyGroupComposer.storyGroup,
      showStoryPreview: state.storyGroupComposer.showStoryPreview,
      editMode: !!editingPostId,
      userData: state.appSidebar.user,
      editingPostId,
      errorMessages: state.storyGroupComposer.errors,
      emptySlotData,
      maxStories: state.storyGroupComposer.maxStories,
      ...options,
    };
  },
  (dispatch, ownProps) => ({
    onOverlayClick: () => {
      dispatch(
        modalsActions.showCloseComposerConfirmationModal({
          page: ownProps.type,
        })
      );
    },
    onCreateStoryGroup: (scheduledAt, shareNow = false) => {
      dispatch(actions.setScheduleLoading(true));
      dispatch(actions.handleSaveStoryGroup(scheduledAt, shareNow));
    },
    onUpdateStoryGroup: ({
      scheduledAt,
      stories,
      storyGroupId,
      shareNow = false,
    }) => {
      dispatch(actions.setScheduleLoading(true));
      dispatch(
        actions.handleUpdateStoryGroup({
          scheduledAt,
          stories,
          storyGroupId,
          shareNow,
        })
      );
    },
    saveNote: ({ note, order }) => {
      dispatch(actions.handleSaveStoryNote({ note, order }));
      dispatch(
        actions.trackNote({
          cta: SEGMENT_NAMES.STORIES_COMPOSER_ADD_NOTE,
          note,
          order,
        })
      );
    },
    onPreviewClick: ({ stories, profileId, id, scheduledAt, serviceId }) => {
      const ctaProperties = getCtaProperties(
        SEGMENT_NAMES.STORIES_PREVIEW_COMPOSER
      );
      const counts = getCounts(stories);

      const metadata = {
        storyGroupId: id,
        channel: 'instagram',
        channelId: profileId,
        channelServiceId: serviceId,
        scheduledAt: scheduledAt ? JSON.stringify(scheduledAt) : undefined,
        ...counts,
        ...ctaProperties,
      };
      dispatch(
        previewActions.handlePreviewClick({
          stories,
          profileId,
          id,
          scheduledAt,
        })
      );
      dispatch(actions.handlePreviewClick());
      dispatch(analyticsActions.trackEvent('Story Group Previewed', metadata));
    },
    onClosePreviewClick: () => {
      dispatch(actions.handleClosePreviewClick());
    },
    onCreateNewStoryCard: ({ id, uploaderInstance, file }) => {
      dispatch(actions.createNewStoryCard({ id, uploaderInstance, file }));
    },
    onVideoUploadProcessingStarted: ({
      id,
      uploaderInstance,
      uploadId,
      fileExtension,
      file,
      progress,
      contentType,
    }) => {
      dispatch(
        actions.videoUploadProcessingStarted({
          id,
          uploaderInstance,
          uploadId,
          fileExtension,
          file,
          progress,
          contentType,
        })
      );
    },
    onUploadDraftFile: ({ userData, videoProcessingComplete }) => (
      id,
      file,
      uploadType,
      notifiers,
      createFileUploaderCallback
    ) => {
      const uploadTrackingId = uuid();
      const {
        id: userId,
        s3_upload_signature: s3Signature,
        imageDimensionsKey,
      } = userData;

      const uploadDraftFileCallback = createFileUploaderCallback({
        s3UploadSignature: {
          algorithm: s3Signature.algorithm,
          base64Policy: s3Signature.base64policy,
          bucket: s3Signature.bucket,
          credentials: s3Signature.credentials,
          date: s3Signature.date,
          expires: s3Signature.expires,
          signature: s3Signature.signature,
          successActionStatus: s3Signature.success_action_status,
        },
        userId,
        csrfToken: null,
        imageDimensionsKey,
        serverNotifiers: {
          videoProcessed: processedVideoMeta =>
            videoProcessingComplete(processedVideoMeta),
          profileGroupCreated: () => {},
          profileGroupUpdated: () => {},
          profileGroupDeleted: () => {},
        },
      });

      return uploadDraftFileCallback(
        uploadTrackingId,
        file,
        uploadType,
        notifiers
      );
    },
    onVideoUploadProcessingComplete: ({
      id,
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
      uploadId,
    }) => {
      const videoMaxLength = 15 * 1000; // 15s
      if (durationMs > videoMaxLength) {
        dispatch(
          actions.showError({
            message:
              'Heads up! Your video is over the 15 second max limit for an Instagram Story. Instagram will clip the end of your video down to the first 15 seconds.',
            uploadId,
          })
        );
      }
      dispatch(
        actions.videoUploadProcessingComplete({
          id,
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
          uploadId,
        })
      );
    },
    onUpdateStoryUploadProgress: ({
      id,
      uploaderInstance,
      progress,
      file,
      complete,
    }) => {
      dispatch(
        actions.updateStoryUploadProgress({
          id,
          uploaderInstance,
          progress,
          file,
          complete,
        })
      );
      actions.updateStoryPogress(dispatch);
    },
    onMonitorUpdateProgress: updateUploadProgress => async ({
      id,
      uploaderInstance,
      file,
    }) => {
      const progressIterator = uploaderInstance.getProgressIterator();
      let item;

      while (!(item = progressIterator.next()).done) {
        // eslint-disable-line no-cond-assign
        const promisedProgress = item.value;

        await promisedProgress.then((
          progress // eslint-disable-line no-await-in-loop
        ) =>
          updateUploadProgress({
            id,
            uploaderInstance,
            progress,
            file,
            complete: false,
          })
        );
      }
      updateUploadProgress({
        id,
        uploaderInstance,
        file,
        complete: true,
        progress: 100,
      });
    },
    onUploadImageComplete: ({
      id,
      uploaderInstance,
      url,
      width,
      height,
      file,
      stillGifUrl,
      contentType,
    }) => {
      dispatch(
        actions.uploadImageComplete({
          id,
          uploaderInstance,
          url,
          width,
          height,
          file,
          stillGifUrl,
          contentType,
        })
      );
      dispatch(
        actions.trackAspectRatio({
          width,
          height,
          cta: SEGMENT_NAMES.STORIES_IMAGE_ASPECT_RATIO_UPLOADED,
          id,
        })
      );
    },
    onDropCard: (cardSource, cardTarget, end = false) => {
      if (end) {
        dispatch(actions.trackDroppedCard(cardSource, cardTarget));
      } else {
        dispatch(actions.onDropCard(cardSource, cardTarget));
      }
    },
    onDeleteStory: storyCard => {
      dispatch(actions.deleteStory(storyCard));
    },
    onRemoveNotifications: () => {
      dispatch(actions.hideError());
    },
    onShowErrorNotification: ({ message }) => {
      dispatch(actions.showError({ message }));
    },
  })
)(StoryGroupPopover);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
