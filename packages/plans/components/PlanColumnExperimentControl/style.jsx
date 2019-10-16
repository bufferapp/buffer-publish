import styled from 'styled-components';
import { borderRadius } from '@bufferapp/ui/style/borders';

export const ColumnStyle = styled.div`
  box-shadow: 0px 0px 16px #00000014;
  border-radius: ${borderRadius};
  margin-right: 24px;
  padding: 45px;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

export const ButtonWrapperStyle = styled.div`
  margin: 24px 0px 8px;
`;

export const FooterStyle = styled.div`
  text-align: center;
  margin-top: auto;
`;

export const ImageWrapperStyle = styled.div`
  margin: 0px auto 30px;
`;

export const TopContentStyle = styled.div`
  text-align: center;
`;

export const UsersStyle = styled.span`
  align-items: center;
  justify-content: center;
  display: flex;
  color: blue;
`;

export const IconStyle = styled.span`
  display: flex;
  padding-right: 4px;
`;

export const PriceStyle = styled.span`
  h1 {
    margin-bottom: 5px;
  }
`;

export const FeatureListStyle = styled.span`
  margin-top: 35px;
`;