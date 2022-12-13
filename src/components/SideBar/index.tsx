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

interface ItemType {
  position: string;
  company: string;
}

interface SideBarState {
  items: Array<ItemType>;
  search: string
}

class SideBar extends React.Component<any, SideBarState> {
  constructor(props: any) {
    super(props)

    this.state = {
      items: [
        { position: "SDE · Finance", company: "Hudson River Trading" },
        { position: "PM · Entertainment", company: "TikTok" },
        { position: "SDE · Entertainment", company: "Netflix" },
      ],
      search: ''
    }
  }
  searchUpdate(keyword: string) {
    fetch(`http://localhost:3005/api/composite/positions?limit=10&search_string=${keyword}`)
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        this.setState({
          items: result.positions.map((pos: any) => {
            return {
              position: pos.name,
              company: pos.company.name
            };
          })
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.searchUpdate('')
  }
  updateInput(e: any) {
    this.setState({
      search: e.target.value
    })
  }
  render() {
    return (
      <Container>
        <SearchWrapper>
          <SearchInput placeholder="Search Job" onChange={this.updateInput.bind(this)} />
          <SearchIcon onClick={() => { this.searchUpdate(this.state.search) }} />
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
              elements={
                this.state.items.map((item: ItemType) => {
                  return (
                    <News header={item.position} topic={item.company} />
                  )
                })
              }
            />
          </Body>
        </StickyBox>
      </Container>
    );
  }
}

export default SideBar;
