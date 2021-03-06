import { actionTypes as orgActionTypes } from '@bufferapp/publish-data-organizations';
import { actions, actionTypes } from './actions';

const eventQueue = [];

export default ({ dispatch, getState }) => next => action => {
  // eslint-disable-line no-unused-vars
  next(action);
  switch (action.type) {
    case actionTypes.INIT:
      if (window.analytics) {
        window.analytics.identify(action.userId, action.payload);
      }
      break;
    case actionTypes.TRACK_EVENT: {
      const orgId = getState().organizations.selected?.globalOrgId;
      if (!orgId) {
        eventQueue.push(action);
      }
      if (orgId && window.analytics) {
        window.analytics.track(action.eventName, {
          product: window.PRODUCT_TRACKING_KEY,
          clientName: window.CLIENT_NAME,
          organizationId: orgId,
          ...action.payload,
        });
      }
      break;
    }
    case orgActionTypes.ORGANIZATION_SELECTED: {
      const orgId = getState().organizations.selected?.globalOrgId;
      eventQueue.forEach(event => {
        dispatch(
          actions.trackEvent(event.eventName, {
            ...event.payload,
          })
        );
      });
      break;
    }
    case actionTypes.PAGE_CHANGE:
      // currently using track event for page change logic, leaving here for now
      if (window.analytics) {
        window.analytics.page(action.pageName, {
          product: window.PRODUCT_TRACKING_KEY,
          ...action.payload,
        });
      }
      break;
    default:
      break;
  }
};
