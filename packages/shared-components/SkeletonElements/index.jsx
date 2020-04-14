import styled, { css, keyframes } from 'styled-components';
import { Text, Button } from '@bufferapp/ui';
import {
  grayLight,
  grayLighter,
  transparent,
} from '@bufferapp/ui/style/colors';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const animation = () =>
  css`
    ${pulse} 2s ease-in-out infinite alternate;
  `;

export const skeletonStyles = css`
  border: ${transparent};
  fill: ${transparent};
  *:before {
    background-color: ${transparent};
  }
  border-color: ${transparent};
  background-color: ${transparent};
  color: ${transparent};
  cursor: auto;
  background-image: linear-gradient(
    270deg,
    ${grayLighter} 18.75%,
    ${grayLight} 100%
  );
  animation: ${animation};
  user-select: none;
`;

export const ButtonWithSkeleton = styled(Button)`
  ${props => props.displaySkeleton && skeletonStyles}
  ${props =>
    props.displaySkeleton &&
    css`
      border: 1px solid ${transparent};
    `}
`;

export const TextWithSkeleton = styled(Text)`
  ${props => props.displaySkeleton && skeletonStyles}
  ${props =>
    props.displaySkeleton &&
    css`
      border-radius: 4px;
    `}
`;
