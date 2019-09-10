import styled from 'styled-components';
import { grayLight, grayLighter } from '@bufferapp/ui/style/colors';

const cardMargin = 4;

export const Arrow = styled.button`
  cursor: pointer;
  top: 50%;
  transform: translateY(calc(-50% - 16px));
  position: absolute;
  left: ${props => (props.prev ? 0 : 'initial')};
  right: ${props => (props.prev ? 'initial' : 0)};
  background-color: ${grayLight};
  border: 1px solid ${grayLight};
  height: 32px;
  width: 32px;
  margin: 16px;
  outline: none;
  border-radius: 2px;
`;

export const CarouselContainer = styled.div`
  display: flex;
  padding-left: ${props => (props.editMode ? '16px' : 0)};
  width: calc(${props => props.cardWidth + (cardMargin * 2)}px *  ${$props => $props.totalCards});
  transform: ${props => `translateX(calc(-${props.cardWidth + (cardMargin * 2)}px * ${props.selectedItem}`}));
  transition: all 0.3s ease-out;
`;

export const CarouselCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => (props.editMode ? `${cardMargin}px` : `16px ${cardMargin}px`)};
  height: ${$props => $props.cardHeight}px;
  width: ${$props => $props.cardWidth}px;
  background-color: ${grayLighter};
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.card.thumbnail_url});
`;

export const SliderCarousel = styled.div`
  position: relative;
  overflow: hidden;
  margin: ${props => (props.editMode ? '0 -16px 0 -16px' : '0 16px 0 12px')};
`;

export const IconWrapper = styled.div`
  display: flex;
  opacity: 0.8;
`;