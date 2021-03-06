import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Input, Button, Link } from '@bufferapp/ui';
import { SimpleColorPicker } from '@bufferapp/publish-shared-components';
import { borderRadius } from '@bufferapp/ui/style/borders';
import { View } from '@bufferapp/ui/Icon';
import { getURL } from '@bufferapp/publish-server/formatters';
import { useTranslation } from 'react-i18next';
import {
  grayLight,
  grayLighter,
  grayDark,
  white,
  purple,
  pink,
  pinkLighter,
  orange,
  yellow,
  green,
  teal,
  blueDark,
  grayShadow,
} from '@bufferapp/ui/style/colors';

/* Styles */
const Wrapper = styled.div`
  background-color: ${grayLighter};
  height: 100%;
`;

const Main = styled.main`
  width: 362px;
  margin: 53px 0 0 283px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
  border: 1px solid ${grayLight};
  box-sizing: border-box;
  border-radius: ${borderRadius};
  box-shadow: ${grayShadow};
  width: 100%;
  padding: 0 16px;
`;

const Headline = styled(Text)`
  text-align: center;
`;

const NoticeCard = styled(Card)`
  flex-direction: row;
  border: 1px solid ${grayLight};
  background: none;
  box-shadow: none;
  margin: 16px 0 24px;
  padding: 16px;
`;

const Notice = styled.div`
  flex: 1;
  align-items: baseline;
`;

const NoticeText = styled(Text)`
  margin: 0 0 0 8px;
  color: ${grayDark};
`;

/* List of colors for the color picker */
const colors = [
  { color: purple, colorName: 'purple' },
  { color: pink, colorName: 'pink' },
  { color: pinkLighter, colorName: 'pink lighter' },
  { color: orange, colorName: 'orange' },
  { color: yellow, colorName: 'yellow' },
  { color: green, colorName: 'green' },
  { color: teal, colorName: 'teal' },
  { color: blueDark, colorName: 'blue dark' },
];

/* Component */
const CampaignForm = ({
  campaignId,
  onCreateOrUpdateCampaignClick,
  onCancelClick,
  isLoading,
  editMode,
  campaign,
  fetchCampaign,
  hasCampaignsFlip,
}) => {
  if (!hasCampaignsFlip) {
    window.location = getURL.getPublishUrl();
    return null;
  }
  // Fetch the Data
  useEffect(() => {
    if (editMode) {
      fetchCampaign({ campaignId });
    }
  }, [campaignId]);

  // State
  const [campaignName, setName] = useState('');
  const [colorSelected, setColor] = useState(purple);
  const [isSubmitButtonDisabled, disableSubmit] = useState(true);

  useEffect(() => {
    if (editMode) {
      setName(campaign?.name);
      setColor(campaign?.color);
    }
  }, [campaign]);

  // autofocus name input
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const { t } = useTranslation();

  // State modifiers
  const disableCampaignSubmitButton = ({ name, color }) => {
    const isSaveButtonDisabled = !name.trim() || !color.trim();
    disableSubmit(isSaveButtonDisabled);
  };

  const setCampaignName = event => {
    const { value } = event.target;
    disableCampaignSubmitButton({ name: value, color: colorSelected });
    setName(value);
  };

  const setCampaignColor = event => {
    const { value } = event.target;
    disableCampaignSubmitButton({ name: campaignName, color: value });
    setColor(value);
  };

  return (
    <Wrapper>
      <Main id="main">
        <Card>
          <Headline type="h2">
            {editMode
              ? t('campaigns.campaignForm.editTitle')
              : t('campaigns.campaignForm.createTitle')}
          </Headline>
          <Input
            id="campaignName"
            type="text"
            value={campaignName || ''}
            onChange={setCampaignName}
            required
            name={t('campaigns.campaignForm.name')}
            label={t('campaigns.campaignForm.name')}
            placeholder={t('campaigns.campaignForm.placeholder')}
            ref={inputElement}
          />
          <Text htmlFor="colorPicker" type="label">
            {t('campaigns.campaignForm.color')}
          </Text>
          <SimpleColorPicker
            id="colorPicker"
            colors={colors}
            colorSelected={colorSelected}
            onColorClick={setCampaignColor}
          />
          <Button
            type="primary"
            size="large"
            label={t('campaigns.campaignForm.saveCampaign')}
            onClick={() =>
              onCreateOrUpdateCampaignClick({
                campaignId,
                colorSelected,
                campaignName,
                editMode,
                orgId: campaign?.globalOrganizationId,
              })
            }
            disabled={isSubmitButtonDisabled || isLoading}
            fullWidth
          />
          <Button
            type="text"
            size="large"
            label={t('campaigns.campaignForm.cancel')}
            onClick={onCancelClick}
            fullWidth
          />
        </Card>
        <NoticeCard>
          <View color={grayDark} />
          <Notice>
            <NoticeText type="p" color={grayDark}>
              {t('campaigns.campaignForm.notice1')}
              <Link
                href="https://support.buffer.com/hc/en-us/articles/360046266313-creating-and-managing-campaigns"
                newTab
              >
                {t('campaigns.campaignForm.notice2')}
              </Link>
              {t('campaigns.campaignForm.notice3')}
            </NoticeText>
          </Notice>
        </NoticeCard>
      </Main>
    </Wrapper>
  );
};

CampaignForm.propTypes = {
  campaignId: PropTypes.string,
  fetchCampaign: PropTypes.func.isRequired,
  onCreateOrUpdateCampaignClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasCampaignsFlip: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  campaign: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    globalOrganizationId: PropTypes.string,
  }),
};

CampaignForm.defaultProps = {
  campaignId: '',
  editMode: false,
  campaign: {},
};

export default CampaignForm;
