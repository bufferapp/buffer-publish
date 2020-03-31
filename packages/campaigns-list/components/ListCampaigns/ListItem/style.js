import styled from 'styled-components';
import {
  grayDark,
  grayDarker,
  grayLight,
  grayLighter,
  blue,
} from '@bufferapp/ui/style/colors';
import { fontWeightMedium } from '@bufferapp/ui/style/fonts';
import { Link } from 'react-router-dom';

export const Color = styled.div`
  height: 12px;
  max-width: 12px;
  width: 100%;
  border-radius: 50%;
  position: absolute;
  background-color: ${props => props.color};
  margin: 7px 10px 0px 0px;
`;

// using grid layout to align the campaign list details
export const Container = styled.li`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 0.7fr 1fr;
  grid-column-gap: 24px;
  padding: 16px;
  border-top: 1px solid ${grayLight};
  align-items: center;
  transition: background-color 250ms ease-in-out;
  :hover {
    background-color: ${grayLighter};
  }
`;

export const LastUpdated = styled.span`
  color: ${grayDark};
`;

export const StyledLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
  color: ${grayDarker};
  position: relative;
  :hover {
    transition: color 150ms ease-in;
    color: ${blue};
  }
  h3 {
    color: inherit;
    margin: 0px 0px 0px 20px;
  }
`;

export const Group = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  p {
    font-weight: ${fontWeightMedium};
  }
`;

export const Icon = styled.span`
  margin-right: 8px;
  svg {
    align-items: center;
    display: flex;
    color: ${grayDarker};
  }
`;

export const LeftWrapper = styled.div`
  p {
    margin: 4px 0px 0px 22px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
