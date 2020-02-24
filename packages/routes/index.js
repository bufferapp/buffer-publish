const profileRouteRegex = /profile\/(\w+)\/tab\/(\w+)(?:\/(\w+))?/;
export const getProfilePageParams = ({ path }) => {
  const match = profileRouteRegex.exec(path);
  if (!match) {
    return null;
  }
  return {
    profileId: match[1],
    tabId: match[2],
    childTabId: match[3],
  };
};

export const generateChildTabRoute = ({
  profileId,
  tabId = 'queue',
  childTabId = 'general-settings',
}) => `/profile/${profileId}/tab/${tabId}/${childTabId}`;

export const generateProfilePageRoute = ({ profileId, tabId = 'queue' }) =>
  `/profile/${profileId}/tab/${tabId}`;

export const profilePageRoute = generateProfilePageRoute({
  profileId: ':profileId',
  tabId: ':tabId',
});

export const childTabRoute = generateChildTabRoute({
  profileId: ':profileId',
  tabId: ':tabId',
  childTabId: ':childTabId',
});

export const generatePreferencePageRoute = ({ preferenceId }) =>
  `/preferences/${preferenceId}`;

export const plansPageRoute = '/plans';

export const newBusinessTrialistsRoute = '/new-business-trialists';

export const newConnectionRoute = '/new-connection';

export const preferencePageRoute = generatePreferencePageRoute({
  preferenceId: ':preferenceId',
});

export const campaignsPageRoute = '/campaigns';
export const campaignsCreateRoute = '/campaigns/new';

export const generateCampaignPageRoute = ({ campaignId, selectedPage }) =>
  `/campaigns/${campaignId}/${selectedPage}`;

export const campaignRoute = generateCampaignPageRoute({
  campaignId: ':campaignId',
  selectedPage: ':selectedPage',
});

export const campaignPages = {
  CREATE_CAMPAIGN: 'new',
  EDIT_CAMPAIGN: 'edit',
  VIEW_CAMPAIGN: 'scheduled',
  VIEW_ALL_CAMPAIGNS: 'campaigns',
};

const isCampaignsHome = match => match === campaignPages.VIEW_ALL_CAMPAIGNS;
const isCampaignsCreate = match => match === campaignPages.CREATE_CAMPAIGN;

export const getCampaignPageFromMatch = match => {
  const fullUrl = match[0];
  const firstMatch = match[1];
  const secondMatch = match[2];

  if (isCampaignsHome(fullUrl)) return campaignPages.VIEW_ALL_CAMPAIGNS;
  if (isCampaignsCreate(firstMatch)) return campaignPages.CREATE_CAMPAIGN;
  if (!secondMatch && !isCampaignsCreate(firstMatch)) return campaignPages.VIEW_CAMPAIGN;

  return secondMatch;
};

const campaignRouteRegex = /campaigns\/?(\w+)?\/?(\w+)?/;
export const getCampaignUrlMatch = ({ path }) => campaignRouteRegex.exec(path);

export const getCampaignPageParams = ({ path }) => {
  const match = getCampaignUrlMatch({ path });

  if (!match) {
    return null;
  }

  const campaignPage = getCampaignPageFromMatch(match);
  const campaignId = !isCampaignsCreate(match[1]) ? match[1] : null;

  return {
    campaigns: match[0],
    campaignId,
    selectedPage: campaignPage,
  };
};

const preferenceRouteRegex = /preferences\/(\w+)/;
export const getPreferencePageParams = ({ path }) => {
  const match = preferenceRouteRegex.exec(path);
  if (!match) {
    return null;
  }
  return {
    preferenceId: match[1],
  };
};
