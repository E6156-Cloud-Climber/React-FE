import React from 'react';
import StickyBox from 'react-sticky-box';

import List from '../List';
import FollowSuggestion from '../FollowSuggestion';
import News from '../News';

import {
  Container,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Body,
} from './styles';

const SideBar: React.FC = () => {
  return (
    <Container>
      <SearchWrapper>
        <SearchInput placeholder="Search Job" />
        <SearchIcon />
      </SearchWrapper>

      <StickyBox>
        <Body>
          {/* <List
            title="You might like"
            elements={[
              <FollowSuggestion name="Wuldku Kizon" nickname="@wkizon" />,
              <FollowSuggestion name="Oriny Figash" nickname="@OrinyFi22" />,
              <FollowSuggestion name="Maxe Nenial" nickname="@maxe_nenial" />,
            ]}
          /> */}

          <List
            title="Trending jobs"
            elements={[
              <News
                header="SDE · Finance"
                topic="Hudson River Trading"
                link="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW2fnRgdkD4k6dZuISJ40jEYRBDPASxmZzow&usqp=CAU"
              />,
              <News
                header="PM · Entertainment"
                topic="TikTok"
                link="data:image/png;base64,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"
              />,
              <News
                header="SDE · Entertainment"
                topic="Netflix"
                link="https://i.ytimg.com/vi/Hs-1_HNALhw/maxresdefault.jpg"
              />,
            ]}
          />
        </Body>
      </StickyBox>
    </Container>
  );
};

export default SideBar;
