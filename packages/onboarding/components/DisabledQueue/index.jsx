import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Tooltip } from '@bufferapp/ui';
import { white, grayDark } from '@bufferapp/ui/style/colors';
import { fontSize, fontWeight } from '@bufferapp/ui/style/fonts';
import {
  Nav,
  NavLink,
  QueueButtonGroup,
  PostEmptySlot,
  ComposerInput,
} from '@bufferapp/publish-shared-components';
/*
  Using the component directly instead of the Higher-order
  component, to avoid having to deal with the state and api
  requests to the profiles endpoint, since in this case we
  don't have profiles and the ProfileSidebar is not set to
  accomodate this edge case.
*/
import ProfileSidebar from '@bufferapp/publish-profile-sidebar/components/ProfileSidebar';

const ProfilePage = styled.div`
  display: flex;
  flex-grow: 1;
`;

const ProfileSidebarWrapper = styled.div`
  flex-basis: 16rem;
  width: 16rem;
  min-width: 16rem;
  position: sticky;
  bottom: 0;
  top: 0;
  max-height: 100vh;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;
  margin-right: 1rem;
  min-height: 100%;
`;

const TabsWrapper = styled.div`
  padding-left: 0.5rem;
  position: relative;
  top: 0;
  background-color: ${white};
  z-index: 1;
`;

const TabWrapper = styled.div`
  display: inline-block;
`;

const Queue = styled.div`
  max-width: 864px;
  height: 100%;
  margin-top: 1rem;
`;

const TopBarContainer = styled.div`
  display: flex;
`;

const ComposerWrapper = styled.div`
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ListHeader = styled.div`
  margin: 1rem 0 1rem 0.5rem;
  display: flex;
  align-items: center;
`;

const HeaderTextDate = styled.span`
  font-weight: ${fontWeight};
  line-height: normal;
  font-size: ${fontSize};
  text-transform: uppercase;
  color: ${grayDark};
  margin-left: 8px;
`;

const HeaderText = styled.div`
  display: flex;
  align-items: baseline;
`;

const calendarBtns = ['Day', 'Week', 'Month'];

const getCurrentDay = () => moment().format('MMMM D');

const DisabledQueue = ({
  translations,
  showUpgradeToProCta,
  profileLimit,
  manageChannelsURL,
  connectChannelsURL,
  connectDirectURLs,
}) => (
  <ProfilePage>
    <ProfileSidebarWrapper>
      <ProfileSidebar
        showUpgradeToProCta={showUpgradeToProCta}
        translations={translations}
        profileLimit={profileLimit}
        manageChannelsURL={manageChannelsURL}
        connectChannelsURL={connectChannelsURL}
        connectDirectURLs={connectDirectURLs}
        loading={false}
      />
    </ProfileSidebarWrapper>
    <Content>
      <TabsWrapper>
        <Nav disabled>
          <NavLink forceSelect disabled>
            {translations.queueTab}
          </NavLink>
          <TabWrapper>
            <Tooltip
              label="Connect a channel to explore this tab"
              position="bottom"
            >
              <NavLink disabled>{translations.analyticsTab}</NavLink>
            </Tooltip>
          </TabWrapper>
          <TabWrapper>
            <Tooltip
              label="Connect a channel to explore this tab"
              position="bottom"
            >
              <NavLink disabled>{translations.awaitingTab}</NavLink>
            </Tooltip>
          </TabWrapper>
          <TabWrapper>
            <Tooltip
              label="Connect a channel to explore this tab"
              position="bottom"
            >
              <NavLink disabled>{translations.draftsTab}</NavLink>
            </Tooltip>
          </TabWrapper>
          <TabWrapper>
            <Tooltip
              label="Connect a channel to explore this tab"
              position="bottom"
            >
              <NavLink disabled>{translations.settingsTab}</NavLink>
            </Tooltip>
          </TabWrapper>
        </Nav>
      </TabsWrapper>
      <Queue>
        <TopBarContainer>
          <ComposerWrapper>
            <Tooltip
              label="Connect a channel to start sharing content"
              position="bottom"
            >
              <ComposerInput
                isDisabled
                placeholder={translations.composerInput}
              />
            </Tooltip>
          </ComposerWrapper>
        </TopBarContainer>
        <ListHeader>
          <HeaderText>
            <Text type="h3">{translations.currentDay}</Text>
            <HeaderTextDate>
              <Text>{getCurrentDay()}</Text>
            </HeaderTextDate>
          </HeaderText>
          <div style={{ marginLeft: 'auto' }}>
            <Tooltip
              label="Connect a channel to see calendar views of your posts"
              position="top"
            >
              <QueueButtonGroup
                buttons={calendarBtns}
                onClick={() => {}}
                disabled
              />
            </Tooltip>
          </div>
        </ListHeader>
        <PostEmptySlot time="08:33 am" service="noProfile" onClick={() => {}} />
        <PostEmptySlot time="5:33 pm" service="noProfile" onClick={() => {}} />
      </Queue>
    </Content>
  </ProfilePage>
);

DisabledQueue.propTypes = {
  translations: PropTypes.shape({
    connectButton: PropTypes.string,
    queueTab: PropTypes.string,
    analyticsTab: PropTypes.string,
    awaitingTab: PropTypes.string,
    draftsTab: PropTypes.string,
    settingsTab: PropTypes.string,
    composerInput: PropTypes.string,
    currentDay: PropTypes.string,
  }).isRequired,
  profileLimit: PropTypes.number.isRequired,
  showUpgradeToProCta: PropTypes.bool.isRequired,
  manageChannelsURL: PropTypes.string.isRequired,
  connectChannelsURL: PropTypes.string.isRequired,
  connectDirectURLs: PropTypes.shape({
    facebook: PropTypes.string,
    instagram: PropTypes.string,
    twitter: PropTypes.string,
  }).isRequired,
};

export default DisabledQueue;
