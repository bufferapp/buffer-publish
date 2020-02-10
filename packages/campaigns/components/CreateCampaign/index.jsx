import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from '@bufferapp/components';
import { Text, Input, Button } from '@bufferapp/ui';
import { SimpleColorPicker } from '@bufferapp/publish-shared-components';
import { borderRadius } from '@bufferapp/ui/style/borders';
import { View } from '@bufferapp/ui/Icon';
import {
  gray,
  grayLight,
  grayLighter,
  grayDark,
  blue,
  white,
  purple,
  pink,
  orange,
  yellow,
  green,
  teal,
  blueDark,
} from '@bufferapp/ui/style/colors';

/* Styles */
const Wrapper = styled.div`
  background-color: ${grayLighter};
  height: 100%;
  text-align: center;
`;

const Content = styled.div`
  width: 362px;
  margin: 53px 0 0 283px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${white};
  border: 1px solid ${gray};
  box-sizing: border-box;
  border-radius: ${borderRadius};
  width: 100%;
  padding: 0 16px;
  text-align: left;
`;

const NoticeCard = styled(Card)`
  flex-direction: row;
  border: 1px solid ${grayLight};
  background: none;
  margin: 16px 0 24px;
  padding: 24px 16px;
`;

const Notice = styled.div`
  flex: 1;
  align-items: baseline;
`;

const NoticeText = styled(Text)`
  margin: 0 0 0 8px;
  color: ${grayDark};
`;

const LinkText = styled(Text)`
  color: ${blue};
  margin: 0;
  display: inline-block;
`;

/* List of colors for the color picker */
const colors = [
  { color: purple, colorName: 'purple' },
  { color: pink, colorName: 'pink' },
  { color: '#F0A8DE', colorName: 'pink lighter' }, // add to BDS
  { color: orange, colorName: 'orange' },
  { color: yellow, colorName: 'yellow' },
  { color: green, colorName: 'green' },
  { color: teal, colorName: 'teal' },
  { color: blueDark, colorName: 'blue dark' },
];

/* Component */
const CreateCampaign = ({
  translations,
  onCreateCampaignClick,
  onCancelClick,
}) => {
  // campaignName state, set by the name input
  const [campaignName, setName] = useState('');
  const setCampaignName = event => {
    const { value } = event.target;
    setName(value);
  };
  // colorSelected state, set by the color picker
  const [colorSelected, setColor] = useState(purple);
  const setCampaignColor = event => {
    const { value } = event.target;
    setColor(value);
  };

  return (
    <Wrapper>
      <Content>
        <Text type="h1">{translations.title}</Text>
        <Card>
          <Text type="h3">{translations.subtitle}</Text>
          <Input
            type="input"
            value={campaignName}
            onChange={setCampaignName}
            required
            name={translations.name}
            label={translations.name}
            placeholder={translations.placeholder}
            aria-required="true"
          />
          <Text htmlFor="colorPicker" type="label">
            {translations.color}
          </Text>
          <SimpleColorPicker
            id="colorPicker"
            colors={colors}
            colorSelected={colorSelected}
            onColorClick={setCampaignColor}
          />
        </Card>
        <NoticeCard>
          <View color={grayDark} />
          <Notice>
            <NoticeText type="p" color={grayDark}>
              <b>{translations.notice1}</b>
              {translations.notice2}
              {/* To be replaced by BDS Link, when we create one that's an anchor. FAQ link also has to be replaced */}
              <Link href="https://faq.buffer.com/" unstyled newTab>
                <LinkText type="p">{translations.notice3}</LinkText>
              </Link>
              {translations.notice4}
            </NoticeText>
          </Notice>
        </NoticeCard>
        <Button
          type="primary"
          size="large"
          label={translations.saveCampaign}
          onClick={() => onCreateCampaignClick({ colorSelected, campaignName })}
          fullWidth
        />
        <Button
          type="text"
          size="large"
          label={translations.cancel}
          onClick={onCancelClick}
          fullWidth
        />
      </Content>
    </Wrapper>
  );
};

CreateCampaign.propTypes = {
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    notice1: PropTypes.string.isRequired,
    notice2: PropTypes.string.isRequired,
    notice3: PropTypes.string.isRequired,
    notice4: PropTypes.string.isRequired,
    saveCampaign: PropTypes.string.isRequired,
    cancel: PropTypes.string.isRequired,
  }).isRequired,
  onCreateCampaignClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
};

export default CreateCampaign;
