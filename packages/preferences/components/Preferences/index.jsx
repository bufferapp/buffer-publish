import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav, NavLink } from '@bufferapp/publish-shared-components';
import { Button } from '@bufferapp/ui';
import { ArrowLeft } from '@bufferapp/ui/Icon';
import { gray } from '@bufferapp/ui/style/colors';
import {
  preferencesAppsExtras,
  preferencesSecurity,
  preferencesNotifications,
  preferencesGeneral,
} from '@bufferapp/publish-routes';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import ManageAppsAndExtras from '@bufferapp/manage-apps-extras';
import Notifications from '@bufferapp/publish-account-notifications';
import ProfileSidebarComponent from '@bufferapp/publish-profile-sidebar/components/ProfileSidebar';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import Security from '../Security';
import General from '../General';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const PreferencesWrapper = styled.div`
  flex-grow: 1;
  padding: 0 1rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const TabStyle = styled.div`
  overflow-y: auto;
  height: calc(100vh - 161px); /* 56px appshell + 57px tabs + 48px banner*/
`;

const ContainerStyle = styled.div`
  max-width: 864px;
  padding-top: 16px;
  margin: 0 auto;
`;

const Preferences = ({
  onBackToDashboardClick,
  selectedProfileId,
  profiles,
  canSeeBillingInfo,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <PreferencesWrapper>
        <Nav>
          <NavLink to={preferencesGeneral.route} activeOnlyWhenExact>
            {t('preferences.menu.general')}
          </NavLink>
          <NavLink to={preferencesSecurity.route} activeOnlyWhenExact>
            {t('preferences.menu.security')}
          </NavLink>
          <NavLink to={preferencesNotifications.route} activeOnlyWhenExact>
            {t('preferences.menu.notifications')}
          </NavLink>
          <NavLink to={preferencesAppsExtras.route} activeOnlyWhenExact>
            {t('preferences.menu.appsAndExtras')}
          </NavLink>
          {canSeeBillingInfo && (
            <NavLink
              href={getURL.getBillingURL({
                cta: SEGMENT_NAMES.PREFERENCES_TAB_BILLING,
              })}
            >
              {t('preferences.menu.billing')}
            </NavLink>
          )}
        </Nav>
        <TabStyle>
          <ContainerStyle>
            <Button
              type="secondary"
              size="small"
              icon={<ArrowLeft color={gray} />}
              label={t('preferences.backToDashboard')}
              onClick={() =>
                onBackToDashboardClick({
                  selectedProfileId,
                  profiles,
                })
              }
            />
            <main id="main">
              <Switch>
                <Route
                  path={preferencesAppsExtras.route}
                  component={ManageAppsAndExtras}
                />
                <Route path={preferencesSecurity.route} component={Security} />
                <Route
                  path={preferencesNotifications.route}
                  component={Notifications}
                />
                <Route path={preferencesGeneral.route} component={General} />
                <Redirect to={preferencesGeneral.route} />
              </Switch>
            </main>
          </ContainerStyle>
        </TabStyle>
      </PreferencesWrapper>
    </Wrapper>
  );
};

Preferences.propTypes = {
  onBackToDashboardClick: PropTypes.func.isRequired,
  selectedProfileId: ProfileSidebarComponent.propTypes.selectedProfileId,
  profiles: ProfileSidebarComponent.propTypes.profiles.isRequired,
  canSeeBillingInfo: PropTypes.bool.isRequired,
};

Preferences.defaultProps = {
  selectedProfileId: undefined,
};

export default Preferences;
