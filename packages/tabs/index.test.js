import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import TabNavigation, {
  reducer,
  actions,
  actionTypes,
  middleware,
} from './index';

const storeFake = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('TabNavigation', () => {
  const store = storeFake({
    profileSidebar: {
      selectedProfile: {
        business: true,
        isManager: true,
        type: 'linkedin',
      },
      isLockedProfile: false,
    },
    appSidebar: {
      user: {
        canStartProTrial: true,
        trial: {
          onTrial: false,
        },
      },
    },
    generalSettings: {
      isInstagramProfile: false,
    },
    environment: {
      environment: 'production',
    },
    productFeatures: {
      planName: 'pro',
    },
  });

  it('should render', () => {
    const wrapper = mount(
      <Provider store={store}>
        <TabNavigation />
      </Provider>,
    );
    expect(wrapper.find(TabNavigation).length)
      .toBe(1);
  });

  it('should export reducer', () => {
    expect(reducer)
      .toBeDefined();
  });

  it('should export actions', () => {
    expect(actions)
      .toBeDefined();
  });

  it('should export actionTypes', () => {
    expect(actionTypes)
      .toBeDefined();
  });

  it('should export middleware', () => {
    expect(middleware)
      .toBeDefined();
  });
});
