import styled from 'styled-components';

export const DEFAULT_COLOR = '#2C4BFF';
export const colorSwatches = {
  white: '#FFFFFF',
  black: '#000000',
  green: '#87C221',
  blue: '#2C4BFF',
  lightBlue: '#1DA1F2',
  orange: '#FF702C',
  pink: '#E466C5',
  purple: '#6D1EB3',
  red: '#F73F16',
  aqua: '#2AB4B4',
};

export const ColorWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const ColorSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid grey;
  border-radius: 4px;
  margin-left: 8px;
  padding: 0px 8px;
  height: 36px;
  position: relative;
`;

export const CheckmarkWrapper = styled.div`
  position: absolute;
  display: flex;
`;

export const CircleColor = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background-color: ${props => (props.color ? props.color : DEFAULT_COLOR)};
  color: ${props => (props.color === colorSwatches.white ? colorSwatches.black : colorSwatches.white)};
  border: ${props =>
    props.color === colorSwatches.white
      ? '1px solid #000000'
      : `1px solid ${props.color}`};
  margin-right: 6px;
  margin-bottom: ${props => (props.selectable ? '10px' : '0px')};
  cursor: ${props => (props.selectable ? 'pointer' : 'auto')};
  :hover {
    :after {
      content: '';
      width: 31px;
      height: 31px;
      border: 1px solid #4307ff;
      border-radius: 50%;
      display: block;
      margin: -5px -5px;
    }
  }
`;

export const ColorSelector = styled.div`
  position: absolute;
  z-index: 1000;
  width: 155px;
  height: 121px;
  background-color: white;
  border-radius: 5px;
  padding: 15px 16px 10px 16px;
  border: 1px solid lightgrey;
  left: 0;
  top: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ColorContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ColorInputWrapper = styled.div`
  background-color: ${props => (props.color ? props.color : DEFAULT_COLOR)};
  border: 1px solid lightgrey;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  z-index: 9;
  cursor: pointer;
  height: 33px;
  width: 33px;
`;

export const ColorInput = styled.input`
  opacity: 0;
  height: 29px;
  width: 29px;
  border: 1px solid gray;
  border-right: none;
  cursor: pointer;
`;

export const InputWrapper = styled.div`
  margin-left: -2px;
`;

export const ColorSwatchesContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-right: -6px;
`;
