import {
  getProfilePageParams,
  generateProfilePageRoute,
  generateChildTabRoute,
  preferencePageRoute,
  profilePageRoute,
  childTabRoute,
  generatePreferencePageRoute,
  getPreferencePageParams,
  getParams,
  getMatch,
} from './index';

describe('publish-routes', () => {
  describe('getProfilePageParams', () => {
    it('should get params from path', () => {
      const profileId = '1234adf';
      const tabId = 'tabid123';
      const childTabId = 'childTab123';
      const path = `/profile/${profileId}/tab/${tabId}/${childTabId}`;
      expect(getProfilePageParams({ path })).toEqual({
        profileId,
        tabId,
        childTabId,
      });
    });

    it('should not get params from path with missing values', () => {
      const path = '/profile/';
      expect(getProfilePageParams({ path })).toBe(null);
    });
  });

  describe('generateProfilePageRoute', () => {
    it('should generate profile route', () => {
      const profileId = '1234adf';
      const tabId = 'tabid123';
      expect(
        generateProfilePageRoute({
          profileId,
          tabId,
        })
      ).toBe(`/profile/${profileId}/tab/${tabId}`);
    });
  });

  describe('generateChildTabRoute', () => {
    it('should generate profile route', () => {
      const profileId = '1234adf';
      const tabId = 'tabid123';
      const childTabId = 'childTab123';
      expect(
        generateChildTabRoute({
          profileId,
          tabId,
          childTabId,
        })
      ).toBe(`/profile/${profileId}/tab/${tabId}/${childTabId}`);
    });
  });

  describe('profilePageRoute', () => {
    it('should return profile page route template', () => {
      expect(profilePageRoute).toBe('/profile/:profileId/tab/:tabId');
    });
  });

  describe('childTabRoute', () => {
    it('should return child tab page route template', () => {
      expect(childTabRoute).toBe('/profile/:profileId/tab/:tabId/:childTabId');
    });
  });

  describe('preferencePageRoute', () => {
    it('should return a preferences page route template', () => {
      expect(preferencePageRoute).toBe('/preferences/:preferenceId');
    });
  });

  describe('generatePreferencePageRoute', () => {
    it('should generate preference page route', () => {
      const preferenceId = '1234adf';
      expect(
        generatePreferencePageRoute({
          preferenceId,
        })
      ).toBe(`/preferences/${preferenceId}`);
    });
  });

  describe('getPreferencePageParams', () => {
    it('should get params from path', () => {
      const preferenceId = '1234adf';
      const path = `/preferences/${preferenceId}`;
      expect(getPreferencePageParams({ path })).toEqual({
        preferenceId,
      });
    });
  });

  describe('getMatch from matching route', () => {
    it('returns details from path', () => {
      const pathname = '/campaigns/id1/scheduled';
      const route = '/campaigns/:id/scheduled/';
      const pathDetails = {
        isExact: true,
        params: {
          id: 'id1',
        },
        path: route,
        url: pathname,
      };
      expect(getMatch({ pathname, route })).toEqual(pathDetails);
    });
    it('returns null if path does not match route', () => {
      const pathname = '/campaigns/scheduled';
      const route = '/campaigns/:id/scheduled/';
      expect(getMatch({ pathname, route })).toEqual(null);
    });
  });

  describe('getParams from matching route', () => {
    it('returns id params from path', () => {
      const pathname = '/campaigns/id1/scheduled';
      const route = '/campaigns/:id/scheduled/';
      expect(getParams({ pathname, route })).toEqual({ id: 'id1' });
    });
    it('returns null if path does not match route', () => {
      const pathname = '/campaigns/scheduled';
      const route = '/campaigns/:id/scheduled/';
      expect(getParams({ pathname, route })).toEqual(null);
    });
  });
});
