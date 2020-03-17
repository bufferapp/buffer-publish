import styled from 'styled-components';
import { grayDark, grayLighter } from '@bufferapp/ui/style/colors';
import { fontWeightMedium } from '@bufferapp/ui/style/fonts';
import { borderRadius } from '@bufferapp/ui/style/borders';

export const Color = styled.div`
  height: 12px;
  max-width: 12px;
  width: 100%;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 7px 10px 0px 0px;
`;

// using grid layout to align the campaign list details
export const Container = styled.li`
  background-color: ${props => (props.isEvenItem ? 'auto' : grayLighter)};
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr 0.7fr 1fr;
  grid-column-gap: 20px;
  padding: 16px;
  border-radius: ${borderRadius};
  align-items: center;
`;

export const LastUpdated = styled.span`
  color: ${grayDark};
`;

export const Title = styled.div`
  h3 {
    margin: 0px;
  }
  display: flex;
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
  margin-right: 7px;
  svg {
    align-items: center;
    display: flex;
  }
`;

export const LeftWrapper = styled.div`
  p {
    margin: 6px 0px 0px 20px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;