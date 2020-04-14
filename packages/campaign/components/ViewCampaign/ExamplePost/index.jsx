import React from 'react';
import PropTypes from 'prop-types';
import {
  Circle,
  CircleWrapper,
  Container,
  Content,
  Footer,
  Header,
  Line,
  LineWrapper,
  LinesWrapper,
  SmallCircle,
  Square,
} from './style';

const ExamplePost = ({ displaySkeleton }) => {
  return (
    <Container>
      <Header>
        <CircleWrapper>
          <Circle displaySkeleton={displaySkeleton} />
          <SmallCircle />
        </CircleWrapper>
        <LineWrapper>
          <Line displaySkeleton={displaySkeleton} width="87px" />
        </LineWrapper>
      </Header>
      <Content>
        <LinesWrapper>
          <Line displaySkeleton={displaySkeleton} />
          <Line displaySkeleton={displaySkeleton} width="400px" />
        </LinesWrapper>
        <Square displaySkeleton={displaySkeleton} />
      </Content>
      <Footer>
        <Line displaySkeleton={displaySkeleton} width="408px" />
        <Line displaySkeleton={displaySkeleton} height="30px" width="100px" />
      </Footer>
    </Container>
  );
};

ExamplePost.propTypes = {
  displaySkeleton: PropTypes.bool,
};

ExamplePost.defaultProps = {
  displaySkeleton: false,
};

export default ExamplePost;
