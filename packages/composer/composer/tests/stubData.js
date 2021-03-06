export const fakeMetaData = {
  appEnvironment: 'WEB_DASHBOARD',
  browser: null,
  composerInitiator: null,
  didUserSetScheduledAt: null,
  disableTelemetry: false,
  enableTwitterChanges: true,
  environment: 'local',
  extensionVersion: null,
  facebookMentionEntities: null,
  images: null,
  isPinnedToSlot: null,
  isPrefillingExistingUpdate: false,
  linkData: null,
  retweetData: null,
  scheduledAt: null,
  shouldDisplayHelpButton: false,
  shouldEnableFacebookAutocomplete: true,
  shouldShowRolloutTooltip: false,
  shouldUseNewTwitterAutocomplete: false,
  sourceUrl: null,
  text: null,
  updateId: null,
  url: null,
  via: null,
  video: null,
};

export const fakeUserData = {
  id: 'foo',
  s3UploadSignature: {},
  uses24hTime: false,
  profileGroups: [],
  weekStartsMonday: false,
  shouldAlwaysSkipEmptyTextAlert: false,
  profilesSchedulesSlots: [],
  onNewPublish: false,
};

export const fakeImageData = {
  url: 'https://an-image.url',
  thumbnail: 'https://a-thumbnail.url',
};

export const fakeVideoData = {
  availableThumbnails: [
    'https://buffer-media-uploads.s3.amazonaws.com/547f…8de37e94dd5bd11dfdcdbf/output/thumbnail_00001.png',
  ],
  duration: 6,
  durationMs: 5850,
  height: 480,
  mediaType: 'VIDEO',
  name: 'SampleVideo_720x480_1mb',
  originalUrl:
    'https://buffer-media-uploads.s3.amazonaws.com/547f391eb04102e822ea0779/5a8de37e94dd5bd11dfdcdbf/b9e3953e682dcef5e85101ba2fb2be5b.original.mp4',
  size: 1362998,
  thumbnail:
    'https://buffer-media-uploads.s3.amazonaws.com/547f391eb04102e822ea0779/5a8de37e94dd5bd11dfdcdbf/output/thumbnail_00001.png',
  uploadId: '5a8de37e94dd5bd11dfdcdbf',
  url:
    'https://buffer-media-uploads.s3.amazonaws.com/547f391eb04102e822ea0779/5a8de37e94dd5bd11dfdcdbf/output/b9e3953e682dcef5e85101ba2fb2be5b.original.mp4',
  wasEdited: false,
  width: 640,
};

export const rawProfilesData = [
  {
    id: '5a2b29cedb60dfae007b23c6',
    imagesAvatar:
      'https://media.licdn.com/media/AAEAAQAAAAAAAAoDAAAAJGRmODFmYmY3LTkyZjMtNDZjYS1iMTlmLWM1YjQ3NzhkMDVkMw.jpg',
    instagramDirectEnabled: true,
    isDisabled: false,
    serviceFormattedUsername: 'Emily Plummer',
    serviceName: 'linkedin',
    serviceType: 'profile',
    serviceUsername: 'Emily Plummer',
    shouldBeAutoSelected: true,
    subprofiles: [],
    timezone: 'America/Hermosillo',
  },
  {
    id: '5a81d9ae63fbc389007b23c6',
    imagesAvatar:
      'https://scontent.cdninstagram.com/vp/46a7600f131b5125e3a5976d9e214f26/5B19936A/t51.2885-19/s150x150/22639451_1711266118925014_5362926912903577600_n.jpg',
    instagramDirectEnabled: true,
    isDisabled: false,
    serviceFormattedUsername: 'emplumeria',
    hasPushNotifications: true,
    serviceName: 'instagram',
    serviceType: 'profile',
    serviceUsername: 'emplumeria',
    shouldBeAutoSelected: false,
    subprofiles: [],
    timezone: 'America/Hermosillo',
  },
  {
    id: '59c420f583768201008b456b',
    imagesAvatar: 'http://via.placeholder.com/60x60',
    instagramDirectEnabled: true,
    isDisabled: false,
    serviceFormattedUsername: '@Buffer Admin',
    serviceName: 'twitter',
    serviceType: 'profile',
    serviceUsername: 'Buffer Admin',
    shouldBeAutoSelected: false,
    subprofiles: [],
    timezone: 'Europe/London',
  },
  {
    id: '59cd5270b7ca102c007b23c6',
    imagesAvatar:
      'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    instagramDirectEnabled: true,
    isDisabled: false,
    serviceFormattedUsername: '@testemilytestte',
    serviceName: 'twitter',
    serviceType: 'profile',
    serviceUsername: 'testemilytestte',
    shouldBeAutoSelected: false,
    subprofiles: [],
    timezone: 'America/Los_Angeles',
  },
  {
    id: '59cd5270b7ca102c117a12b1',
    imagesAvatar:
      'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    instagramDirectEnabled: true,
    isDisabled: false,
    serviceFormattedUsername: 'Test Facebook Page',
    serviceName: 'facebook',
    serviceType: 'page',
    serviceUsername: 'test_facebook_page',
    shouldBeAutoSelected: false,
    subprofiles: [],
    timezone: 'America/Los_Angeles',
  },
];
