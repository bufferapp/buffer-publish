import styled from 'styled-components';
import { grayLight, grayLighter, gray } from '@bufferapp/ui/style/colors';
import { Text } from '@bufferapp/ui';
import { MAX_HEIGHT } from '../../utils/Tags';

export const PersonIcon = styled.div`
  position: absolute;
  bottom: 22px;
  left: 22px;
  padding: 6px;
  cursor: pointer;
  border-radius: 50%;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  vertical-align: middle;
  display: inline-flex;
`;

export const TextWrapper = styled.span`
  margin: 2px 0px 16px;
  display: flex;
  color: ${gray};
`;

export const Modal = styled.div`
  display: flex;
`;

export const ModalInner = styled.div`
  background-color: white;
  display: flex;
`;

export const Image = styled.img`
  max-height: ${MAX_HEIGHT}px;
  max-width: 100%;
  width: auto;
  margin: 0;
  cursor: crosshair;
  display: block;
`;

export const ResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: black;
`;

export const RightContent = styled.div`
  width: 350px;
  min-height: 499px; /* Set min height so modal will stay same size on input display */
  display: flex;
  flex-direction: column;
`;

export const TagList = styled.div`
  overflow: scroll;
  height: 148px;
`;

export const TopContent = styled.div`
  margin-bottom: auto;
`;

export const BottomContent = styled.div`
  padding: 0 24px 24px;
`;

export const Line = styled.hr`
  width: 100%;
  border: 1px solid ${grayLight};
`;

export const RightHeader = styled.div`
  padding: 6px 24px 24px;
`;

export const InputWrapper = styled.div`
  border-bottom: 2px solid white;
  display: flex;
  background-color: ${grayLighter};
  padding: 16px 24px;
  min-height: 72px;
`;

export const Title = styled(Text)`
  margin-bottom: 10px;
`;

export const FooterButtons = styled.div`
  display: flex;
`;

export const SaveButton = styled.div`
  width: 100%;
`;

export const ImageWrapper = styled.div`
  position: relative;
`;
