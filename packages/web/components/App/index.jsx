import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import AppPages from '@bufferapp/publish-app-pages';
import AppShell from '@bufferapp/publish-app-shell';
import Notifications from '@bufferapp/notifications';
import InitialLoading from '@bufferapp/publish-initial-loading';
import AppModals from '@bufferapp/publish-modals';
import CTABanner from '@bufferapp/publish-cta-banner';
import TemporaryBanner from '@bufferapp/publish-temporary-banner';
import ThirdParty from '@bufferapp/publish-thirdparty';

const ThirdPartyWithRouter = withRouter(ThirdParty);

const appStyle = {
  display: 'flex',
  height: '100%',
};

const contentStyle = {
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  width: '100vw',
  background: '#fff',
  height: '100%',
};

// Can't use stateless function for App since then
// the `DragDropContext` doesn't work.
// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <div style={appStyle} className="notranslate">
        <AppShell>
          <div style={contentStyle}>
            <CTABanner />
            <TemporaryBanner />
            <InitialLoading>
              <AppPages />
            </InitialLoading>
          </div>
        </AppShell>
        <Notifications />
        <AppModals />
        <ThirdPartyWithRouter />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
