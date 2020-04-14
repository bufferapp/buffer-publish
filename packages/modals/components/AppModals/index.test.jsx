import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';

import AppModalsConnected from '../../index';
import AppModals from './index';
import { initialState } from '../../reducer';

const fakeStore = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('Modals', () => {
  it('renders nothing when no modals are visible', () => {
    const visibleModals = { ...initialState, showSwitchPlanModal: false };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <AppModals {...visibleModals} />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders upgrade modal', () => {
    const visibleModals = { ...initialState, showSwitchPlanModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <AppModals {...visibleModals} />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders a connected upgrade modal', () => {
    const visibleModals = { ...initialState, showSwitchPlanModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <Provider store={fakeStore({ modals: visibleModals })}>
        <AppModalsConnected />
      </Provider>,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders welcome modal', () => {
    const visibleModals = { ...initialState, showWelcomeModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <AppModals {...visibleModals} />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders a connected welcome modal', () => {
    const visibleModals = { ...initialState, showWelcomeModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <Provider store={fakeStore({ modals: visibleModals })}>
        <AppModalsConnected />
      </Provider>,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders disconnected profiles modal', () => {
    const visibleModals = { ...initialState, showProfilesDisconnectedModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <AppModals {...visibleModals} />,
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders a connected disconnected profiles modal', () => {
    const visibleModals = { ...initialState, showProfilesDisconnectedModal: true };
    const renderer = new ShallowRenderer();
    const rendered = renderer.render(
      <Provider store={fakeStore({ modals: visibleModals })}>
        <AppModalsConnected />
      </Provider>,
    );
    expect(rendered).toMatchSnapshot();
  });
});
