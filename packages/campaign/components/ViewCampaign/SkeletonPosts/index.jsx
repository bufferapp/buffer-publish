import React from 'react';
import { AnimatedList } from '@bufferapp/publish-shared-components';
import ExamplePost from '../ExamplePost';

const SkeletonPosts = () => {
  return (
    <AnimatedList>
      <ExamplePost displaySkeleton />
      <ExamplePost displaySkeleton />
    </AnimatedList>
  );
};

export default SkeletonPosts;
