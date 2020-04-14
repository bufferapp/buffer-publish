import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import ExamplePost from '../ExamplePost';

const pulse = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const animation = () =>
  css`
    ${pulse} 2s ease infinite forwards;
  `;

const Container = styled.div`
  > * {
    animation: ${animation};
    opacity: 0;
  }

  > :nth-child(2) {
    animation-delay: 0.5s;
  }
`;

const SkeletonPosts = () => {
  return (
    <Container>
      <ExamplePost displaySkeleton />
      <ExamplePost displaySkeleton />
    </Container>
  );
};

export default SkeletonPosts;
