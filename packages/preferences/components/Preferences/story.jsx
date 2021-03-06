import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'connected-react-router';
import createHistory from 'history/createHashHistory';
import store from '@bufferapp/publish-store';
import Preferences from './index';

const history = createHistory();

storiesOf('Preferences', module)
  .addDecorator(withA11y)
  .addDecorator(getStory => (
    <Provider store={store}>
      <Router history={history}>{getStory()}</Router>
    </Provider>
  ))
  .add('default', () => (
    <Preferences
      onBackToDashboardClick={e => {
        e.preventDefault();
        action('onBackToDashboardClick')(e);
      }}
      canSeeBillingInfo
    />
  ))
  .add('with tab selected', () => (
    <Preferences
      onBackToDashboardClick={e => {
        e.preventDefault();
        action('onBackToDashboardClick')(e);
      }}
      canSeeBillingInfo
    />
  ))
  .add('without billing tab', () => (
    <Preferences
      onBackToDashboardClick={e => {
        e.preventDefault();
        action('onBackToDashboardClick')(e);
      }}
      canSeeBillingInfo={false}
    />
  ));
