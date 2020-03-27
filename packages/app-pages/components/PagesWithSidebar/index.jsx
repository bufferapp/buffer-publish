import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import CampaignForm from '@bufferapp/publish-campaign-form';
import ViewCampaign from '@bufferapp/publish-campaign';
import ListCampaigns from '@bufferapp/publish-campaigns-list';
import {
  campaignScheduled,
  campaignsPage,
  campaignCreate,
  campaignEdit,
} from '@bufferapp/publish-routes';
import PageWithSidebarWrapper from '@bufferapp/publish-app-pages/components/PageWithSidebarWrapper';

const ScrollableContainer = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 1px;
`;

const PagesWithSidebar = () => {
  return (
    <PageWithSidebarWrapper>
      <ScrollableContainer>
        <Switch>
          <Route path={campaignCreate.route} component={CampaignForm} />
          <Route
            path={campaignEdit.route}
            render={props => <CampaignForm {...props} editMode />}
          />
          <Route path={campaignScheduled.route} component={ViewCampaign} />
          <Route path={campaignsPage.route} component={ListCampaigns} />
        </Switch>
      </ScrollableContainer>
    </PageWithSidebarWrapper>
  );
};

export default PagesWithSidebar;
