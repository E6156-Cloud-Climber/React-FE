import React from 'react';

import Tweet from '../Tweet';
import Timeline from '../Timeline';
import { Container, Tab, Tweets } from './styles';

const Feed: React.FC = () => {
  return (
    <Container>
      <Tab>Posts</Tab>
      <Tweets>
        <Tweet />
      </Tweets>
      <Timeline />
    </Container>
  );
};

export default Feed;
