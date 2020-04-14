import styled from 'styled-components';
import { gray, grayLighter } from '@bufferapp/ui/style/colors';
import { skeletonStyles } from '@bufferapp/publish-shared-components';

export const Container = styled.div`
  display: flex;
  border: 1px solid ${gray};
  border-radius: 4px;
  margin-top: 15px;
  flex-direction: column;
`;

export const Circle = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${grayLighter};
  margin-right: 8px;
  ${props => props.displaySkeleton && skeletonStyles}
`;

export const SmallCircle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${grayLighter};
  ${props => props.displaySkeleton && skeletonStyles}
`;

export const CircleWrapper = styled.div`
  position: relative;
`;

export const Square = styled.div`
  height: 150px;
  width: 150px;
  background-color: ${grayLighter};
  margin-left: 10px;
  border-radius: 4px;
  ${props => props.displaySkeleton && skeletonStyles}
`;

export const Header = styled.div`
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 10px;
  flex-direction: row;
`;

export const Line = styled.div`
  border-radius: 4px;
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '10px')};
  background-color: ${grayLighter};
  ${props => props.displaySkeleton && skeletonStyles}
`;

export const Content = styled.div`
  display: flex;
  padding: 20px 10px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Footer = styled.div`
  display: flex;
  border-top: 1px solid #e0e0e0;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;

export const LinesWrapper = styled.div`
  display: flex;
  width: 85%;
  flex-direction: column;

  div {
    margin-bottom: 10px;
  }
`;

export const LineWrapper = styled.div`
  margin-left: 10px;
`;
