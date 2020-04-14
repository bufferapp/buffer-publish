import { push } from 'connected-react-router';
import { matchPath } from 'react-router-dom';

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

export const getMatch = ({ pathname, route }) =>
  matchPath(pathname, {
    path: route,
  });

export const getParams = ({ pathname, route }) => {
  const match = getMatch({ pathname, route });
  return match?.params || null;
};

export const campaignsPage = {
  route: '/campaigns',
  goTo: () => push('/campaigns'),
};

export const campaignCreate = {
  route: '/campaigns/new',
  goTo: () => push('/campaigns/new'),
};

export const campaignEdit = {
  route: '/campaigns/:id/edit/',
  goTo: ({ campaignId, from }) =>
    push(`/campaigns/${campaignId}/edit`, { from }),
};

export const campaignScheduled = {
  route: '/campaigns/:id/scheduled/',
  getRoute: ({ campaignId }) => `/campaigns/${campaignId}/scheduled`,
  goTo: ({ campaignId }) => push(`/campaigns/${campaignId}/scheduled`),
};

export const campaignSent = {
  route: '/campaigns/:id/sent/',
  goTo: ({ campaignId }) => push(`/campaigns/${campaignId}/sent`),
};

export const goTo = path => push(path);
