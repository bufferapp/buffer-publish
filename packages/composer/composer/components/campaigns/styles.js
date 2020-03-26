import styled from 'styled-components';
import { gray, white, grayLight } from '@bufferapp/ui/style/colors';
import CheckmarkIcon from '@bufferapp/ui/Icon/Icons/Checkmark';

export const SelectWrapper = styled.div`
  display: flex;
  min-width: 275px;
  justify-content: center;
  margin-left: auto;
  p {
    margin-left: 0px !important;
  }
  button {
    margin-left: 10px;
  }
`;

export const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
`;

export const Color = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
  display: flex;
  flex-shrink: 0;
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-left: 9px;
`;

export const Separator = styled.div`
  border-top: 1px solid ${grayLight};
  margin: 15px -20px;
`;

export const CustomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition-property: background-color, border-color, color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 0 0 auto;
  font-family: 'Roboto', sans-serif;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 16px;
  padding-left: 16px;
  height: 40px;
  background-color: ${white};
  border: 1px solid ${gray};
  justify-content: space-between;
`;

export const Checkmark = styled(CheckmarkIcon)`
  margin-right: 8px;
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  p {
    margin-left: 0px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  min-width: 24px;
`;

export const TextWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
`;
