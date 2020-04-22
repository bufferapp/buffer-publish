import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Button } from '@bufferapp/ui';
import translations from '@bufferapp/publish-i18n/translations/en-us.json';
import CTABanner, { reducer, actions, actionTypes, middleware } from './index';
import BillingUpdateCTABanner from './components/BillingUpgradeCTABanner';

describe('CtaBanner', () => {
  describe('Component', () => {
    let store;

    beforeEach(() => {
      const storeFake = state => ({
        default: () => {},
        subscribe: () => {},
        dispatch: jest.fn(),
        getState: () => ({ ...state }),
      });

      store = storeFake({
        appSidebar: {
          user: {
            trial: {
              onTrial: true, // user has to be on a trial for the Banner to be displayed
            },
            plan: 'premium_business',
          },
        },
        ctaBanner: {
          profileCount: 1,
        },
        i18n: {
          translations: {
            'billing-upgrade-cta-banner':
              translations['billing-upgrade-cta-banner'],
          },
        },
        productFeatures: {
          planName: 'business',
          features: {},
        },
      });
    });

    it('renders', () => {
      const wrapper = mount(
        <Provider store={store}>
          <CTABanner />
        </Provider>
      );
      expect(wrapper.find(BillingUpdateCTABanner).length).toBe(1);
      wrapper.unmount();
    });

    it('dispatches a handleStartSubscription action when user clicks on start subscription', () => {
      const wrapper = mount(
        <Provider store={store}>
          <CTABanner />
        </Provider>
      );

      // User clicks to start subscription in the trial banner
      wrapper
        .find(BillingUpdateCTABanner)
        .find(Button)
        .at(0)
        .find('button')
        .at(0)
        .simulate('click');

      expect(store.dispatch).toHaveBeenCalledWith(
        actions.handleStartSubscription()
      );
      wrapper.unmount();
    });
  });

  it('exports reducer', () => {
    expect(reducer).toBeDefined();
  });

  it('exports actions', () => {
    expect(actions).toBeDefined();
  });

  it('exports actionTypes', () => {
    expect(actionTypes).toBeDefined();
  });

  it('exports middleware', () => {
    expect(middleware).toBeDefined();
  });
});
