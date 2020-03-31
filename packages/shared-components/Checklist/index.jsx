import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Text } from '@bufferapp/ui';
import { blue, white } from '@bufferapp/ui/style/colors';
import CheckmarkIcon from '@bufferapp/ui/Icon/Icons/Checkmark';

const StyledText = styled(Text)`
  flex: 1;
  margin: 0 0 0 8px;
  align-self: flex-start;
`;

const ItemContainer = styled.li`
  display: flex;
  margin: 18px 0;
  align-items: baseline;
`;

const CheckListContainer = styled.ul`
  margin: 0;
  padding: 0;
`;

const StyledCheckmark = styled.span`
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${blue};

  svg {
    color: ${white};
  }
`;

const CheckList = ({ items }) => (
  <CheckListContainer>
    {items.map(item => (
      <ItemContainer key={uuid()}>
        <StyledCheckmark>
          <CheckmarkIcon size="medium" />
        </StyledCheckmark>
        <StyledText type="p">{item}</StyledText>
      </ItemContainer>
    ))}
  </CheckListContainer>
);

CheckList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CheckList;
