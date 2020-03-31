/**
 * Helpers to format input data, only used on initialization.
 *
 * While MC call sites store input data differently, they all have one thing
 * in common: all this data is stored inside a larger object. The import methods
 * below take advantage of this knowledge by retrieving data from different parts
 * of these larger objects, depending on the environment they're in.
 */

import { AppEnvironments } from '@bufferapp/publish-constants';
import { DataImportEnvironments } from '../AppConstants';

const DataImportUtils = {
  extractPropsFromBufferGlobal: bufferGlobal => ({
    userData: bufferGlobal.user,
    metaData: Object.assign({}, bufferGlobal.meta, {
      images: bufferGlobal.meta.picture ? [bufferGlobal.meta.picture] : null,
      retweet: bufferGlobal.meta.retweet
        ? Object.assign({}, bufferGlobal.meta.retweet, {
            text: bufferGlobal.meta.text.replace(
              `RT @${bufferGlobal.meta.retweet.user_name}: `,
              ''
            ),
          })
        : null,
    }),
    csrfToken: bufferGlobal.csrfToken,
    imageDimensionsKey: bufferGlobal.imageDimensionsKey,
  }),

  formatDataImportEnv: env => {
    const dataImportEnv =
      env === 'BOOKMARKLET_PHP'
        ? DataImportEnvironments.BOOKMARKLET_PHP
        : env === 'WEB_DASHBOARD'
        ? DataImportEnvironments.WEB_DASHBOARD
        : undefined;

    return dataImportEnv || env;
  },

  formatAppEnv: appEnv => {
    const appEnvironment =
      appEnv === 'OVERLAY'
        ? AppEnvironments.EXTENSION
        : appEnv === 'WEB'
        ? AppEnvironments.WEB_DASHBOARD
        : appEnv === 'ONBOARDING'
        ? AppEnvironments.ONBOARDING
        : undefined;

    return appEnvironment || appEnv;
  },

  formatInputData: ({
    env,
    data,
    options: { canSelectProfiles = true, saveButtons, ...restOptions } = {},
  }) => {
    const dataImportEnv = DataImportUtils.formatDataImportEnv(env);
    const userData = DataImportUtils.formatUserData(dataImportEnv, data);

    const defaultSaveButtons = userData.hasSimplifiedFreePlanUX
      ? ['ADD_TO_QUEUE', 'SHARE_NOW', 'SCHEDULE_POST']
      : ['ADD_TO_QUEUE', 'SHARE_NEXT', 'SHARE_NOW', 'SCHEDULE_POST'];

    if (saveButtons === undefined) saveButtons = defaultSaveButtons;

    const metaData = DataImportUtils.formatMetaData(dataImportEnv, data);

    return {
      profilesData: DataImportUtils.formatProfilesData(
        dataImportEnv,
        data,
        metaData
      ),
      userData,
      metaData,
      options: { canSelectProfiles, saveButtons, ...restOptions },
      csrfToken: data.csrfToken,
      imageDimensionsKey: data.imageDimensionsKey,
    };
  },

  formatProfilesData: (
    dataImportEnv,
    { profiles, subprofileId },
    formattedMetaData
  ) => {
    const data = [];

    profiles.forEach(importedProfile => {
      const subprofiles = importedProfile.subprofiles
        ? importedProfile.subprofiles.map(
            ({ name, avatar, id, profile_id, is_shared }) => ({
              id,
              name,
              avatar,
              profileId: profile_id,
              isShared: is_shared,
              shouldBeAutoSelected: id === subprofileId,
            })
          )
        : [];

      const isEditingUpdate = formattedMetaData.updateId !== null;
      const isTwitterPostingRestrictedForProfile =
        formattedMetaData.isPrefillingExistingUpdate &&
        !isEditingUpdate &&
        formattedMetaData.existingUpdateProfileService ===
          importedProfile.service &&
        importedProfile.service === 'twitter';

      const isDisabled =
        importedProfile.disabled ||
        /**
         * April 9 2018 - Commented next line to stop
         * forcing prevention of Twitter Re-Buffer as we
         * will show a message instead for now. (@hamish)
         */
        // isTwitterPostingRestrictedForProfile ||
        false;

      data.push({
        id: importedProfile.id,
        serviceName: importedProfile.service,
        serviceUsername: importedProfile.service_username,
        serviceFormattedUsername: importedProfile.formatted_username,
        imagesAvatar: importedProfile.avatar_https,
        timezone: importedProfile.timezone,
        shouldBeAutoSelected:
          dataImportEnv === DataImportEnvironments.BOOKMARKLET_PHP
            ? importedProfile.default
            : importedProfile.selected || importedProfile.open,
        isDisabled,
        disabledMessage:
          isDisabled && isTwitterPostingRestrictedForProfile
            ? 'due to recent Twitter changes, the same tweet cannot be re-buffered to any Twitter account'
            : null,
        serviceType: importedProfile.service_type,
        serviceId: importedProfile.serviceId,
        isBusinessProfile: importedProfile.business,
        isContributor:
          importedProfile.isContributor || importedProfile.is_contributor,
        isManager:
          importedProfile.isManager || importedProfile.organization_role === 1,
        instagramDirectEnabled: importedProfile.should_post_direct,
        shouldShowGridPreview: importedProfile.shouldShowGridPreview,
        subprofiles,
        hasPushNotifications: importedProfile.hasPushNotifications,
        canPostComment: importedProfile.canPostComment,
        profileHasPostingSchedule: importedProfile.schedules.some(
          item => item.times.length > 0
        ),
      });
    });

    return data;
  },

  formatUserData: (dataImportEnv, { userData }) => {
    let data = {};

    if (userData !== null) {
      const hasFeature = (featureList, feature) =>
        featureList && featureList.includes(feature);
      data = Object.assign(
        {
          id: userData.id,
          s3UploadSignature: {
            algorithm: userData.s3_upload_signature.algorithm,
            base64Policy: userData.s3_upload_signature.base64policy,
            bucket: userData.s3_upload_signature.bucket,
            credentials: userData.s3_upload_signature.credentials,
            date: userData.s3_upload_signature.date,
            expires: userData.s3_upload_signature.expires,
            signature: userData.s3_upload_signature.signature,
            successActionStatus:
              userData.s3_upload_signature.success_action_status,
          },
          uses24hTime: userData.uses_24h_time,
          weekStartsMonday: userData.week_starts_monday,
          isFreeUser: userData.is_free_user,
          isBusinessUser: userData.is_business_user,
          canStartProTrial: userData.canStartProTrial,
          hasIGDirectFlip: userData.has_ig_direct_flip,
          shouldAlwaysSkipEmptyTextAlert: userData.skip_empty_text_alert,
          hasSimplifiedFreePlanUX: userData.has_simplified_free_plan_ux,
          hasIGLocationTaggingFeature: userData.hasIGLocationTaggingFeature,
          isOnProTrial: userData.isOnProTrial,
          hasIGDirectVideoFlip: userData.hasIGDirectVideoFlip,
          hasShopgridFlip: hasFeature(userData.features, 'grid_preview'),
          hasCampaignsFlip: hasFeature(userData.features, 'campaigns'),
          isProAndUpOrTeamMember: userData.isProAndUpOrTeamMember,
          profileGroups: userData.profile_groups
            ? userData.profile_groups.map(group => ({
                name: group.name,
                id: group.id,
                profileIds: group.profile_ids,
              }))
            : [],
        },
        typeof userData.profiles_schedules_slots !== 'undefined'
          ? { profilesSchedulesSlots: userData.profiles_schedules_slots }
          : {}
      );
    }

    return data;
  },

  formatMetaData: (
    dataImportEnv,
    { metaData, update, scheduledAt, isPinnedToSlot }
  ) => {
    let data = {};
    let meta;

    switch (dataImportEnv) {
      case DataImportEnvironments.BOOKMARKLET_PHP:
        meta = Object.assign({}, metaData, {
          scheduledAt: null,
          isPinnedToSlot: null,
          didUserSetScheduledAt: null,
          linkData: null,
          images: metaData.images
            ? metaData.images.map(image => ({ picture: image }))
            : null,
          video: null,
          videoThumbnail: null,
          sourceUrl: null,
          locationId: null,
          locationName: null,
          userTags: null,
          campaignId: null,
          facebookMentionEntities: null,
          should_show_rollout_tooltip: false,
          isPrefillingExistingUpdate: false,
          existingUpdateProfileService: null,
        });
        break;

      case DataImportEnvironments.WEB_DASHBOARD: {
        const metaScheduledAt =
          scheduledAt || update.due_at || update.scheduled_at || null;

        const formatImages = images =>
          images.map(image => ({
            ...image,
            picture: image.picture || image.photo,
            alt_text: image.alt_text === 'null' ? null : image.alt_text,
          }));

        const isPrefillingExistingUpdate =
          update.id && Object.keys(update).length > 0;
        const defaultCampaignDetails = metaData.campaignDetails || null;

        meta = Object.assign({}, metaData, {
          isPrefillingExistingUpdate,
          existingUpdateProfileService: isPrefillingExistingUpdate
            ? update.profile_service
            : null,
          should_show_help_button: false,
          updateId: update.id || null,
          scheduledAt: metaScheduledAt,
          isPinnedToSlot:
            metaScheduledAt === null
              ? null
              : isPinnedToSlot !== null && typeof isPinnedToSlot !== 'undefined'
              ? isPinnedToSlot
              : !!update.pinned,
          // Updates that are queued, without a scheduled_at time set by users, will still
          // have a due_at time set by the scheduling engine. Inside MC, we use scheduledAt
          // for the time at which the update will go out, without worrying about its origin.
          // We still keep track of the origin through didUserSetScheduledAt in order to
          // properly format fields for the API. This value isn't imported into the app,
          // and only serves as a reference to previous update state when saving to the API.
          didUserSetScheduledAt:
            metaScheduledAt !== null
              ? !!scheduledAt || !!(update.due_at && update.scheduled_at)
              : null,
          text:
            ((!update.retweet || !update.retweet.comment) && update.text) ||
            null,
          linkData: (update.media && update.media.link && update.media) || null,
          images:
            (update.media &&
              update.media.picture &&
              formatImages([update.media].concat(update.extra_media || []))) ||
            null,
          video: (update.media && update.media.video) || null,
          videoThumbnail:
            (update.media && update.media.video && update.media.thumbnail) ||
            null,
          retweet: update.retweet
            ? Object.assign({}, update.retweet, {
                user_name: update.retweet.username,
                display_name: update.retweet.profile_name,
                avatar_https:
                  update.retweet.avatars && update.retweet.avatars.https,
              })
            : null,
          sourceUrl: update.source_url || null,
          locationId: update.service_geolocation_id || null,
          locationName: update.service_geolocation_name || null,
          userTags: update.service_user_tags || null,
          campaignDetails: update.campaignDetails || defaultCampaignDetails,
          facebookMentionEntities: update.entities || null,
          commentEnabled: update.commentEnabled,
          commentText: update.commentText || null,
          shopgridLink: update.shopgridLink || null,
          tabId: metaData.tabId || null,
          emptySlotMode: metaData.emptySlotMode || false,
        });
        break;
      }

      default:
        throw new Error(
          `formatMetaData() can't find data to format for import env ${dataImportEnv}`
        );
    }

    if (meta !== null) {
      const getFormattedLinkData = ({ link, title, description, preview }) => ({
        url: link,
        title,
        description,
        thumbnail: preview,
      });

      const getFormattedRetweetData = ({
        text,
        comment,
        tweet_id,
        user_id,
        user_name,
        display_name,
        url,
        avatar_https,
      }) => ({
        text,
        comment,
        tweetId: tweet_id,
        userId: user_id,
        userName: user_name,
        userDisplayName: display_name,
        tweetUrl: url,
        avatarUrl: avatar_https,
      });

      const getFormattedFacebookMentionEntities = entities =>
        entities.map(({ indices, content, text, url }) => ({
          indices: [+indices[0], +indices[1]],
          id: +content,
          name: text,
          url,
        }));

      const getFormattedVideoData = (videoData, videoThumbnail) => ({
        uploadId: videoData.id,
        name: videoData.title,
        availableThumbnails: videoData.thumbnails,
        duration: videoData.details.duration,
        durationMs: videoData.details.duration_millis,
        size: videoData.details.file_size,
        width: videoData.details.width,
        height: videoData.details.height,
        url: videoData.details.transcoded_location,
        originalUrl: videoData.details.location,
        thumbOffset: videoData.thumb_offset,
        thumbnail: videoThumbnail,
      });

      data = {
        environment: meta.environment,
        appEnvironment: DataImportUtils.formatAppEnv(meta.application),
        shouldDisplayHelpButton: meta.should_show_help_button,
        shouldShowRolloutTooltip: meta.should_show_rollout_tooltip,
        shouldEnableFacebookAutocomplete: meta.should_enable_fb_autocomplete,
        shouldUseNewTwitterAutocomplete:
          meta.should_use_new_twitter_autocomplete,
        enableTwitterChanges: meta.enable_twitter_march_18_changes,
        disableTelemetry: meta.disable_telemetry,
        text: meta.text || null,
        url: meta.url || null,
        sourceUrl: meta.sourceUrl || null,
        locationId: meta.locationId || null,
        locationName: meta.locationName || null,
        userTags: meta.userTags || null,
        campaignDetails: meta.campaignDetails || null,
        campaigns: meta.campaigns || null,
        linkData:
          meta.linkData !== null ? getFormattedLinkData(meta.linkData) : null,
        via: meta.via || null,
        images: meta.images || null,
        video:
          meta.video !== null
            ? getFormattedVideoData(meta.video, meta.videoThumbnail)
            : null,
        browser: meta.browser || null,
        composerInitiator: meta.placement || null,
        extensionVersion: meta.version || null,
        retweetData:
          meta.retweet !== null ? getFormattedRetweetData(meta.retweet) : null,
        updateId: meta.updateId || null,
        scheduledAt: meta.scheduledAt || null,
        isPinnedToSlot: meta.isPinnedToSlot,
        didUserSetScheduledAt: meta.didUserSetScheduledAt,
        facebookMentionEntities:
          meta.facebookMentionEntities !== null
            ? getFormattedFacebookMentionEntities(meta.facebookMentionEntities)
            : null,
        isPrefillingExistingUpdate: meta.isPrefillingExistingUpdate,
        existingUpdateProfileService: meta.existingUpdateProfileService,
        commentEnabled: meta.commentEnabled,
        commentText: meta.commentText || null,
        shopgridLink: meta.shopgridLink || null,
        tabId: meta.tabId || null,
        emptySlotMode: meta.emptySlotMode || false,
      };
    }

    return data;
  },
};

export default DataImportUtils;
