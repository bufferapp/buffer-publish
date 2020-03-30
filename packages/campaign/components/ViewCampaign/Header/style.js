import styled from 'styled-components';
import { grayDark } from '@bufferapp/ui/style/colors';
import { Text } from '@bufferapp/ui';
import { fontWeightMedium } from '@bufferapp/ui/style/fonts';

export const Container = styled.header`
  display: flex;
  align-items: baseline;
  margin: 14px 0px 30px;
`;

export const Name = styled(Text)`
  flex: 1;
  margin: 0;
`;

export const Color = styled.div`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

export const LastUpdated = styled.span`
  color: ${grayDark};
`;

export const SubText = styled.div`
  display: flex;
  margin-top: 8px;
  p {
    margin: 0px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  margin-left: auto;
  margin-top: 10px;
  button {
    margin-left: 10px;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-direction: row;
`;

export const CampaignDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Group = styled.div`
  display: flex;
  margin-right: 16px;
  p {
    font-weight: ${fontWeightMedium};
  }
`;

export const Details = styled.div`
  display: flex;
`;

export const Icon = styled.div`
  margin-right: 7px;
  svg {
    vertical-align: middle;
  }
`;
