import fetchJsonp from 'fetch-jsonp';
import partition from 'lodash.partition';
import lruCache from 'lru-cache';
import Request from '@bufferapp/buffer-js-request';
import { AppEnvironments } from '@bufferapp/publish-constants';
import AppActionCreators from '../action-creators/AppActionCreators';
import { QueueingTypes, AttachmentTypes } from '../AppConstants';
import AppStore from '../stores/AppStore';
import API from './API';
import { observeStore } from '../utils/StoreUtils';
import { extractSavedUpdatesIdsFromResponses } from '../utils/APIDataTransforms';
import { getComposerSource, getSegmentMetadata, getSegmentCampaignMetadata } from '../utils/TrackingUtils';

import getFacebookAutocompleteEntities from '../utils/draft-js-custom-plugins/autocomplete/utils/getFacebookAutocompleteEntities';

class APIRequestError extends Error {
  name = 'APIRequestError';
}

const WebAPIUtils = {
  rememberModalView: modalKey => {
    const reqSettings = { credentials: 'same-origin' };
    Request.get(`/message/read/${modalKey}`, {}, reqSettings);
  },
  /**
   * Save the drafts to the API.
   *
   * data = {
   *   queueingType: QueueingTypes.X,
   *   customScheduleTime: timestamp || null,
   *   profiles: [profile, …], // All selected profiles
   *   drafts: [draft, …], // All enabled drafts
   * }
   */
  saveDrafts: ({ queueingType, customScheduleTime, profiles, drafts }) => {
    const { updateId, tabId, emptySlotMode } = AppStore.getMetaData();
    const { partiallySavedDraftsProfilesIds } = AppStore.getAppState();
    // Transform each draft's data to match the API's format
    const draftsDataToSave = drafts.map(draft => ({
      serviceName: draft.service.name,
      formattedData: getFormattedAPIData(draft.service.name, {
        queueingType,
        customScheduleTime: customScheduleTime || draft.scheduledAt,
        serviceProfiles: profiles.filter(profile => {
          const wasUpdateSavedAlreadyForProfile = (
            partiallySavedDraftsProfilesIds.get(draft.service.name) || []
          ).includes(profile.id);

          return (
            profile.service.name === draft.service.name &&
            !wasUpdateSavedAlreadyForProfile
          );
        }),
        serviceDraft: draft,
        isEditingUpdate: updateId !== null,
      }),
    }));

    // Further split requests to prevent more than 10 profiles per request
    const maxProfilesIdsPerRequest = 10;
    const splitDraftsDataToSave = [].concat(
      ...draftsDataToSave.map(draft =>
        draft.formattedData.profile_ids.length < maxProfilesIdsPerRequest
          ? [draft]
          : draft.formattedData.profile_ids
              .map((_, i) =>
                i % maxProfilesIdsPerRequest === 0
                  ? draft.formattedData.profile_ids.slice(
                      i,
                      i + maxProfilesIdsPerRequest
                    )
                  : null
              )
              .filter(profilesIdsGroup => profilesIdsGroup !== null)
              .map(profilesIdsGroup => ({
                ...draft,
                formattedData: {
                  ...draft.formattedData,
                  profile_ids: profilesIdsGroup,
                },
              }))
      )
    );

    /**
     * Make one query per draft.
     *
     * Transform any unexpected network failure into a resolved object
     * with success=false for consistency with API errors, and in order
     * for Promise.all() to not fail early
     */
    const savePromises = splitDraftsDataToSave.map(
      ({ serviceName, formattedData }) => {
        const updatePost =
          queueingType === QueueingTypes.SAVE ||
          queueingType === QueueingTypes.SAVE_AND_APPROVE;
        const endpoint = updatePost
          ? `updates/${updateId}/update.json`
          : 'updates/create.json';

        return API.post(endpoint, formattedData)
          .catch(() => ({
            success: false,
            message: `Whoops, Buffer's servers couldn't be reached to save the
            update, sorry about that. Would you be up for trying again?`,
          }))
          .then(response => {
            if (!updatePost) {
              const post =
                response && response.updates ? response.updates[0] : null;
              if (post) {
                const profile = profiles.find(
                  profileItem => profileItem.id === post.profile_id
                );
                let composerSource = getComposerSource({
                  tabId,
                  emptySlotMode,
                });
                const metadata = getSegmentMetadata({
                  post,
                  profile,
                  formattedData,
                  composerSource,
                  queueingType,
                });
                AppActionCreators.triggerInteraction({
                  message: {
                    action: 'SEGMENT_TRACKING',
                    eventName: 'Post Created',
                    metadata,
                  },
                });
                if (post.campaign_details) {
                  const onCampaignsPage = window.location.pathname.includes(
                    'campaigns'
                  );
                  if (onCampaignsPage) {
                    composerSource = 'campaigns';
                  }
                  const campaignMetadata = getSegmentCampaignMetadata({
                    post,
                    profile,
                    composerSource,
                  });
                  AppActionCreators.triggerInteraction({
                    message: {
                      action: 'SEGMENT_TRACKING',
                      eventName: 'Campaign Item Added',
                      metadata: campaignMetadata,
                    },
                  });
                }
              }
            }
            return Object.assign(response, { serviceName });
          });
      }
    );

    return Promise.all(savePromises).then(responses => {
      /**
       * Since we're splitting requests to never have more than 10 profiles each,
       * we'll sometimes get multiple (un)successful responses for the same draft:
       * - Unsuccessful responses are merged back into one response per draft.
       * - Successful responses are split in two buckets: "fully" successful responses
       *   on one side (i.e. responses for drafts that were saved to all their selected
       *   profiles), and "partially" successful responses (i.e. responses for drafts
       *   that couldn't be saved to all their selected profiles). A draft that was split
       *   in multiple requests will have all of its responses in one of those buckets,
       *   never in both.
       *   - "Fully" successful responses are then merged back into one response per draft
       *   - And we save the "partially" successful responses are used to
       */
      // eslint-disable-next-line prefer-const
      let [unfilteredSuccessfulResponses, unsuccessfulResponses] = partition(
        responses,
        response => response.success
      );

      // eslint-disable-next-line prefer-const
      let [partiallySuccessfulResponses, successfulResponses] = partition(
        unfilteredSuccessfulResponses,
        successfulResponse =>
          unsuccessfulResponses.find(
            unsuccessfulResponse =>
              unsuccessfulResponse.serviceName ===
              successfulResponse.serviceName
          )
      );

      // If a service's responses span both successfulResponses and unsuccessfulResponses,
      // keep track of successful saves for that service in order to skip them during next save
      AppActionCreators.updatePartiallySavedDraftsProfilesIds(
        partiallySuccessfulResponses.map(({ serviceName, updates }) => ({
          draftId: serviceName,
          profilesIds: updates.map(({ profile_id: profileId }) => profileId), // TODO: issue when mult partials?
        }))
      );

      // Merge "fully" successful responses back together again into one response per service
      successfulResponses = successfulResponses.reduce(
        (mergedSuccessfulResponses, response) => {
          const existingServiceEntry = mergedSuccessfulResponses.find(
            mergedResponse =>
              mergedResponse.serviceName === response.serviceName
          );

          if (existingServiceEntry) {
            existingServiceEntry.updates.splice(-1, 0, ...response.updates);
          } else {
            mergedSuccessfulResponses.push(response);
          }

          return mergedSuccessfulResponses;
        },
        []
      );

      // Merge unsuccessful responses back together again into one response per service
      unsuccessfulResponses = unsuccessfulResponses.reduce(
        (mergedUnsuccessfulResponses, response) => {
          const hasExistingServiceEntry = !!mergedUnsuccessfulResponses.find(
            mergedResponse =>
              mergedResponse.serviceName === response.serviceName
          );

          if (!hasExistingServiceEntry) {
            mergedUnsuccessfulResponses.push(response);
          }

          return mergedUnsuccessfulResponses;
        },
        []
      );

      if (successfulResponses.length > 0) {
        const trackingQueueingTypeMap = new Map([
          [QueueingTypes.QUEUE, ['later']],
          [QueueingTypes.NEXT, ['later', 'next']],
          [QueueingTypes.NOW, ['now']],
          [QueueingTypes.CUSTOM, ['schedule']],
          [QueueingTypes.SAVE, ['save']],
          [QueueingTypes.SAVE_AND_APPROVE, ['save-and-approve']],
          [QueueingTypes.ADD_DRAFT, ['add-draft']],
          [QueueingTypes.NEXT_DRAFT, ['add-draft', 'next']],
          [QueueingTypes.CUSTOM_DRAFT, ['schedule-draft']],
        ]);
      }

      return {
        successfulResponses,
        unsuccessfulResponses: overrideAPIErrorResponseMessages({
          unsuccessfulResponses,
          partiallySuccessfulResponses,
          queueingType,
        }),
      };
    });
  },

  approveDrafts: ids =>
    Promise.all(
      ids.map(id =>
        API.get(`updates/${id}/approve.json`).catch(() => ({ success: false }))
      )
    ),

  createNewSubprofile: (profileId, data) => {
    AppActionCreators.createSubprofilePending(profileId);

    return API.post(`profiles/${profileId}/subprofiles/create.json`, data)
      .catch(() => {
        throw new APIRequestError(`Whoops, Buffer's servers couldn't be reached
          to save the board, sorry about that. Would you be up for trying again?`);
      })
      .then(response => {
        if (!response.hasOwnProperty('success') || response.success === false) {
          throw new APIRequestError(`The board couldn't be saved, sorry about that.
            Would you be up for trying again?`);
        } else {
          return {
            profileId: response.subprofile.profile_id,
            id: response.subprofile.id,
            avatar: response.subprofile.avatar,
            name: response.subprofile.name,
            isShared: response.subprofile.is_shared,
          };
        }
      });
  },

  fetchProfileSubprofiles: profileId =>
    API.get(`profiles/${profileId}/fetch_subprofiles.json`).then(response => ({
      subprofiles: response.subprofiles.map(
        ({ profile_id, id, avatar, name, is_shared }) => ({
          profileId: profile_id,
          isShared: is_shared,
          id,
          avatar,
          name,
        })
      ),
    })),

  getAutocompleteSuggestions: (() => {
    const caches = new Map();
    const cacheInvalidationHashes = new Map();

    const getNewCache = () => lruCache({ max: 50 });

    const getCache = (key, invalidationHash = null) => {
      if (!caches.has(key)) caches.set(key, getNewCache());

      // If an invalidationHash is provided, invalidate cache if it's different from the stored hash
      if (invalidationHash !== null) {
        if (cacheInvalidationHashes.has(key)) {
          if (cacheInvalidationHashes.get(key) !== invalidationHash) {
            caches.set(key, getNewCache());
            cacheInvalidationHashes.set(key, invalidationHash);
          }
        } else {
          cacheInvalidationHashes.set(key, invalidationHash);
        }
      }

      return caches.get(key);
    };

    return async function*(serviceName, search, searchType = 'mentions') {
      const cacheInvalidationHash =
        serviceName === 'twitter' && searchType === 'mentions'
          ? AppStore.getTwitterAutocompleteBootstrapDataProfilesIds().join()
          : null;

      const cache = getCache(
        `${serviceName}-${searchType}`,
        cacheInvalidationHash
      );

      // If cached suggestions exist for that search, yield them and stop there
      const cachedSuggestions = cache.get(search);
      if (typeof cachedSuggestions !== 'undefined') {
        yield cachedSuggestions;
        return;
      }

      let suggestions = new Map();

      // Append new suggestions and cache + return complete collection
      const aggregateAndCacheSuggestions = newSuggestions => {
        suggestions = new Map([...suggestions, ...newSuggestions]);
        cache.set(search, suggestions);

        return suggestions;
      };

      if (serviceName === 'twitter' && searchType === 'mentions') {
        const { shouldUseNewTwitterAutocomplete } = AppStore.getMetaData();

        if (shouldUseNewTwitterAutocomplete) {
          // Yield suggestions from bootstrapped data first
          yield getTwitterACBootstrappedSuggestions(search).then(
            aggregateAndCacheSuggestions
          );

          // If we've already reached 10 suggestions for that search, stop there
          if (suggestions.size >= 10) return;

          // Then yield public suggestions
          yield getTwitterACPublicSearchSuggestions(search).then(
            aggregateAndCacheSuggestions
          );
        } else {
          // Yield remotely-fetched suggestions that are relevant to that user
          yield getTwitterACPrivateSearchSuggestions(search).then(
            aggregateAndCacheSuggestions
          );
        }
      } else if (serviceName === 'twitter' && searchType === 'hashtags') {
        yield getTwitterACPublicSearchHashtagSuggestions(search).then(
          aggregateAndCacheSuggestions
        );
      } else if (serviceName === 'facebook' && searchType === 'mentions') {
        yield getFacebookACPrivateSearchSuggestions(search).then(
          aggregateAndCacheSuggestions
        );
      }
    };
  })(),

  getTwitterAutocompleteBootstrapData: profilesIds =>
    API.get(
      'friends/twitter/prefetch.json',
      { profile_ids: profilesIds },
      {},
      { isInternal: true }
    )
      .then(response => {
        if (
          typeof response.success !== 'undefined' &&
          response.success === false
        )
          return {};
        return response;
      })
      .then(response =>
        Object.values(response).reduce(
          (reducedTwitterUsers, resultsPage) =>
            reducedTwitterUsers.concat(
              ...((resultsPage && resultsPage.users) || []).map(
                ({
                  profile_image_url_https: avatar,
                  name: fullName,
                  screen_name: screenName,
                }) => ({ avatar, fullName, screenName })
              )
            ),
          []
        )
      ),

  getImageDimensions: ({
    url,
    key = AppStore.getImageDimensionsKey(),
    user_id = AppStore.getUserData().id,
  }) =>
    // https://image-dimensions.buffer.com/dimensions deprecated
    Request.get(
      'https://fastimage.buffer.com/dimensions',
      {
        user_id,
        key,
        url,
      },
      { mode: 'cors' }
    ).then(response => response.json()),

  getProfileSlotDataForDateRange: (profileId, startDay, endDay) =>
    API.get(`profiles/${profileId}/schedules/slots.json`, {
      start_day: startDay,
      end_day: endDay,
    }),

  getFacebookDomainOwnershipForProfile: (profileId, url) =>
    API.get(`profiles/${profileId}/facebook_domain_ownership.json`, {
      profile_id: profileId,
      url,
    }),
};

function getTwitterACBootstrappedSuggestions(search) {
  return observeStore(AppStore, store =>
    store.isTwitterAutocompleBootstrapDataLoaded()
  ).then(() =>
    AppStore.getMatchingTwitterAutocompleteBootstrapData(search).map(
      ({ avatar, fullName, screenName }) => [
        screenName,
        { avatar, fullName, name: `@${screenName}` },
      ]
    )
  );
}

function getTwitterACPrivateSearchSuggestions(search) {
  return API.get('friends.json', { q: search }).then(privateSearchSuggestions =>
    privateSearchSuggestions.map(
      ({ avatar, name: fullName, screen_name: screenName }) => [
        screenName,
        { avatar, fullName, name: `@${screenName}` },
      ]
    )
  );
}

function getTwitterACPublicSearchSuggestions(search) {
  // TODO: abstract fetchJsonp as an option passed to buffer-js-request
  return fetchJsonp(
    `https://twitter.com/i/search/typeahead.json?count=10&filters=true&result_type=true&src=COMPOSE&q=${search}`
  )
    .then(response => response.json())
    .then(response =>
      response.users.map(
        ({
          profile_image_url_https: avatar,
          name: fullName,
          screen_name: screenName,
        }) => [screenName, { avatar, fullName, name: `@${screenName}` }]
      )
    )
    .catch(error => {
      if (
        error.message.startsWith('JSONP request to') &&
        error.message.endsWith('timed out')
      ) {
        throw new Error(`Whoops, Twitter's servers couldn't be reached for the tagging
                         of Twitter usernames to work, sorry about that. Would you be up
                         for trying again? If this error continues to show up, please
                         feel free to reach out to us!`);
      } else {
        throw new Error(`Whoops, the tagging of Twitter usernames doesn't seem to be working
                         right now, sorry about that. Would you be up for trying again? If
                         this error continues to show up, please feel free to reach out to
                         us with the following error message: <pre>${error.message}</pre>`);
      }
    });
}

function formatPageUrlAsUsername(pageUrl) {
  let newUrl = pageUrl.replace('https://www.facebook.com/', '');
  newUrl = newUrl.replace(/\/$/, '');
  return `@${newUrl}`;
}

function getTwitterACPublicSearchHashtagSuggestions(search) {
  // TODO: abstract fetchJsonp as an option passed to buffer-js-request
  return fetchJsonp(
    `https://twitter.com/i/search/typeahead.json?count=10&filters=true&result_type=hashtags&src=COMPOSE&q=%23${search}`
  )
    .then(response => response.json())
    .then(response =>
      response.hashtags.map(({ hashtag }) => [hashtag, { name: hashtag }])
    )
    .catch(error => {
      if (
        error.message.startsWith('JSONP request to') &&
        error.message.endsWith('timed out')
      ) {
        throw new Error(`Whoops, Twitter's servers couldn't be reached for hashtag suggestions
                         to work, sorry about that. Would you be up for trying again? If this
                         error continues to show up, please feel free to reach out to us!`);
      } else {
        throw new Error(`Whoops, hashtag suggestions don't seem to be working right now, sorry
                         about that. Would you be up for trying again? If this error continues
                         to show up, please feel free to reach out to us with the following
                         error message: <pre>${error.message}</pre>`);
      }
    });
}

function getFacebookACPrivateSearchSuggestions(search) {
  const selectedFbAccounts = AppStore.getSelectedProfilesForService('facebook');
  const selectedFbPages = selectedFbAccounts.filter(
    p => p.serviceType === 'page'
  );

  return API.get('search/facebook_pages.json', {
    q: search,
    profile_id: selectedFbPages[0].id,
  })
    .then(results => {
      if (typeof results === 'object' && results.error) {
        const csrfToken = AppStore.getCsrfToken();
        const oauthLink = `/oauth/reconnect/${selectedFbPages[0].id}?csrf_token=${csrfToken}`;

        throw new Error(`Oops! We lost access to your Facebook account, and can't provide
                         Facebook page tag suggestions as a result. Would you be up for
                         <a href="${oauthLink}" target="_blank">reconnecting that account</a>
                         and trying again?`);
      }
      return results;
    })
    .then(results =>
      results.map(({ name, id, link: url }) => [
        id,
        {
          avatar: 'avatar',
          name,
          id,
          category: formatPageUrlAsUsername(url),
          url,
        },
      ])
    );
}

function overrideAPIErrorResponseMessages({
  unsuccessfulResponses,
  partiallySuccessfulResponses,
  queueingType,
}) {
  return unsuccessfulResponses.map(response => {
    switch (response.code) {
      case 1023:
        response.message = response.message
          .replace(
            'upgrade to Awesome!',
            `<a href="/awesome?utm_campaign=queue_limit_extension&utm_medium=extension"
               target="_blank">upgrade to Awesome</a>!`
          )
          .replace(
            'upgrade to Business!',
            `<a href="/business?utm_campaign=queue_limit_extension&utm_medium=extension"
               target="_blank">upgrade to Business</a>!`
          );
        break;

      default:
        break;
    }

    const hasPartiallySuccessfulResponses = !!partiallySuccessfulResponses.find(
      ({ serviceName }) => serviceName === response.serviceName
    );

    if (hasPartiallySuccessfulResponses) {
      const errorMessageVerbQueueingTypeMap = new Map([
        [QueueingTypes.QUEUE, 'queued'],
        [QueueingTypes.NEXT, 'queued'],
        [QueueingTypes.NOW, 'posted'],
        [QueueingTypes.CUSTOM, 'saved'],
        [QueueingTypes.SAVE, 'saved'],
        [QueueingTypes.SAVE_AND_APPROVE, 'saved and approved'],
        [QueueingTypes.ADD_DRAFT, 'saved'],
        [QueueingTypes.NEXT_DRAFT, 'saved'],
        [QueueingTypes.CUSTOM_DRAFT, 'saved'],
      ]);

      response.message = `Some updates were successfully ${errorMessageVerbQueueingTypeMap.get(
        queueingType
      )},
        but some others weren't, here's what happened if you want to try again for those
        that failed:<br/>${response.message}`;
    }

    return response;
  });
}

/**
 * Transform data to the format the API consumes.
 *
 * unformattedData = {
 *   queueingType: QueueingTypes.X,
 *   customScheduleTime: timestamp || null,
 *   serviceProfiles: [profile, …], // Selected profiles for that service
 *   serviceDraft: draft, // Draft for that service
 *   isEditingUpdate: boolean,
 * }
 */
function getFormattedAPIData(serviceName, unformattedData) {
  const appMetaData = AppStore.getMetaData();
  const { serviceDraft, isEditingUpdate } = unformattedData;
  const serviceDraftText = serviceDraft.editorState
    .getCurrentContent()
    .getPlainText();
  const serviceProfilesIds = unformattedData.serviceProfiles.map(
    profile => profile.id
  );
  const serviceSelectedSubprofiles = unformattedData.serviceProfiles.map(
    profile => profile.selectedSubprofileId
  );
  const hasEnabledLinkAttachment =
    serviceDraft.enabledAttachmentType === AttachmentTypes.LINK &&
    serviceDraft.link !== null;
  const hasImageAttachment = serviceDraft.images.length > 0;
  const hasVideoAttachment = serviceDraft.video !== null;
  const hasGifAttachment = serviceDraft.gif !== null;
  const hasEnabledMediaAttachment =
    serviceDraft.enabledAttachmentType === AttachmentTypes.MEDIA &&
    (hasImageAttachment || hasVideoAttachment || hasGifAttachment);
  const hasEnabledRetweetAttachment =
    serviceDraft.enabledAttachmentType === AttachmentTypes.RETWEET &&
    serviceDraft.retweet !== null;
  const hadEnabledRetweetAttachment =
    appMetaData.retweetData !== null && !hasEnabledRetweetAttachment;
  const hasUnshortenedLinks = serviceDraft.unshortenedUrls.length > 0;
  const shouldShortenLinks = !hasUnshortenedLinks;
  const isUsingCustomScheduleTime = unformattedData.customScheduleTime !== null;

  const getFormattedMediaFields = () => {
    // Default to non-set values on create, and nulls on update in order to
    // override those fields in the API
    let formattedMediaFields = isEditingUpdate
      ? {
          media: null,
          extra_media: null,
        }
      : {};

    if (hasEnabledLinkAttachment) {
      const doesLinkAttachmentHaveThumbnail =
        serviceDraft.link.thumbnail !== null;

      formattedMediaFields = {
        ...formattedMediaFields,
        media: {
          link: serviceDraft.link.url,
          title: serviceDraft.link.title,
          description: serviceDraft.link.description,
        },
      };

      if (doesLinkAttachmentHaveThumbnail) {
        Object.assign(formattedMediaFields.media, {
          preview: serviceDraft.link.thumbnail.url,
          preview_safe: serviceDraft.link.thumbnailHttps,
          picture: serviceDraft.link.thumbnail.url,
        });
      }
    } else if (hasEnabledMediaAttachment) {
      if (hasImageAttachment) {
        const getFormattedImageFields = image => ({
          progress: 100,
          uploaded: true,
          photo: image.url,
          picture: image.url,
          thumbnail: image.url,
          alt_text: image.altText || null,
        });

        const images = serviceDraft.images.slice();
        const [firstImage] = images.splice(0, 1);

        formattedMediaFields = {
          ...formattedMediaFields,
          media: getFormattedImageFields(firstImage),
        };

        // If several images were attached, attach remaining ones to the extra_media field
        if (images.length > 0) {
          formattedMediaFields.extra_media = {};
          let index = 0;

          images.forEach(
            image =>
              (formattedMediaFields.extra_media[
                index++
              ] = getFormattedImageFields(image))
          );
        }
      } else if (hasGifAttachment) {
        const gif = serviceDraft.gif.url;

        formattedMediaFields = {
          ...formattedMediaFields,
          media: {
            progress: 100,
            uploaded: true,
            photo: gif,
            picture: gif,
            thumbnail: gif,
          },
        };
      } else if (hasVideoAttachment) {
        const { video } = serviceDraft;

        formattedMediaFields = {
          ...formattedMediaFields,
          media: {
            progress: 100,
            uploaded: true,
            uploading_type: 'video',
            video: {
              title: video.name,
              id: video.uploadId,
              details: {
                location: video.originalUrl,
                transcoded_location: video.url,
                file_size: video.size,
                duration: video.duration,
                duration_millis: video.durationMs,
                width: video.width,
                height: video.height,
              },
              thumb_offset: video.thumbOffset,
              thumbnails: video.availableThumbnails,
            },
            thumbnail: video.thumbnail,
          },
        };
      }
    }

    return formattedMediaFields;
  };

  const getConditionalFields = () => {
    let conditionalFields = {};

    const didUserSetScheduledAtBeforeSession =
      appMetaData.didUserSetScheduledAt;
    const didUserChangeScheduledAtDuringSession =
      appMetaData.scheduledAt !== unformattedData.customScheduleTime;

    // Only set scheduled_at and pinned fields when an update is created with a
    // custom time, or when it's edited with a custom time and this time wasn't
    // automatically generated by our queueing engine (i.e. the time was user-set)
    if (
      isUsingCustomScheduleTime &&
      (didUserSetScheduledAtBeforeSession ||
        didUserChangeScheduledAtDuringSession)
    ) {
      conditionalFields.scheduled_at = unformattedData.customScheduleTime;
      conditionalFields.pinned = !!serviceDraft.isPinnedToSlot;
    }

    if (serviceDraft.service.hasSubprofiles) {
      // The API expects subprofile_id (a single id) when editing updates
      if (isEditingUpdate) {
        conditionalFields.subprofile_id = serviceSelectedSubprofiles[0];
      } else {
        conditionalFields.subprofile_ids = serviceSelectedSubprofiles;
      }
    }

    if (serviceDraft.service.canHaveSourceUrl) {
      const { sourceLink } = serviceDraft;

      if (sourceLink !== null) {
        let sourceUrl = sourceLink.url;
        if (sourceUrl.indexOf('http') !== 0) sourceUrl = `http://${sourceUrl}`;

        conditionalFields.source_url = sourceUrl;
      }
    }

    if (serviceDraft.service.canHaveLocation) {
      const { locationId, locationName } = serviceDraft;
      conditionalFields.service_geolocation_id = locationId;
      conditionalFields.service_geolocation_name = locationName;
    }

    const { images } = serviceDraft;
    const userTags = images && images[0] && images[0].userTags;
    if (serviceDraft.service.canHaveUserTags) {
      conditionalFields.service_user_tags =
        // Ensuring we send `null` here so it removes the tags when all are removed
        userTags && userTags.length ? userTags : null;
    }

    const { campaignId } = serviceDraft;
    const { hasCampaignsFlip } = AppStore.getUserData();
    if (hasCampaignsFlip) {
      conditionalFields.campaign_id = campaignId;
    }

    if (hasEnabledRetweetAttachment) {
      const { retweet } = serviceDraft;

      conditionalFields = Object.assign(conditionalFields, {
        is_native_retweet: true,
        retweeted_tweet_id: retweet.tweetId,
        retweet: {
          user_id: retweet.userId,
          tweet_id: retweet.tweetId,
          user_name: retweet.userName,
          display_name: retweet.userDisplayName,
          url: retweet.tweetUrl,
          avatar_http: retweet.avatarUrl,
          avatar_https: retweet.avatarUrl,
          comment: serviceDraftText,
        },
      });
      // The API expects retweet to be null when editing an update and removing its retweet attachment
    } else if (isEditingUpdate && hadEnabledRetweetAttachment) {
      conditionalFields = Object.assign(conditionalFields, {
        retweet: null,
      });
    }

    if (serviceDraft.service.name === 'instagram') {
      conditionalFields = Object.assign(conditionalFields, {
        comment_enabled:
          serviceDraft.commentText && serviceDraft.commentText.trim() !== '',
        comment_text: serviceDraft.commentText,
        link: serviceDraft.shopgridLink,
      });
    }
    return conditionalFields;
  };

  return Object.assign(
    {
      now: unformattedData.queueingType === QueueingTypes.NOW,
      top:
        unformattedData.queueingType === QueueingTypes.NEXT ||
        unformattedData.queueingType === QueueingTypes.NEXT_DRAFT,
      is_draft:
        unformattedData.queueingType === QueueingTypes.ADD_DRAFT ||
        unformattedData.queueingType === QueueingTypes.NEXT_DRAFT ||
        unformattedData.queueingType === QueueingTypes.CUSTOM_DRAFT,
      shorten: shouldShortenLinks,
      // When editing updates, the API expects only the text field to be used (not fb_text)
      text: serviceDraftText,
      fb_text:
        serviceName === 'facebook' && !isEditingUpdate ? serviceDraftText : '',
      entities:
        serviceName === 'facebook'
          ? getFacebookAutocompleteEntities(serviceDraft.editorState)
          : null,
      profile_ids: serviceProfilesIds,
      attachment: hasEnabledLinkAttachment,
      via:
        appMetaData.appEnvironment === AppEnvironments.EXTENSION
          ? 'bookmarklet'
          : null,
      source: appMetaData.browser,
      version: appMetaData.extensionVersion,
    },
    getConditionalFields(),
    getFormattedMediaFields()
  );
}

export default WebAPIUtils;
