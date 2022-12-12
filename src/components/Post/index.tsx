import * as React from 'react';
import { Component } from 'react';
import {
  Container,
  TextArea,
  InputContainer,
  SubmitContainer,
  PostContainer,
  PositionContainer,
  Stage,
  Select,
  Input,
} from './styles';

interface PostProps {}

interface PostState {
  interviewPhase: number;
  postContent: string;
  company: string;
  position: string;
  stage: Stage;
  isAnimating: boolean;
}

class Post extends React.Component<PostProps, PostState> {
  state: PostState = {
    interviewPhase: 0,
    postContent: '',
    company: '',
    position: '',
    stage: Stage.Post,
    isAnimating: false,
  };

  handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.stage === Stage.Post) {
      this.setState({ stage: Stage.Position, isAnimating: true }, () =>
        console.log(this.state)
      );
    } else {
      fetch('http://54.84.3.38:3000/api/users/2/posts', { method: 'POST' })
        .then((resp) => {
          return resp.json();
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handlePrevButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ stage: Stage.Post, isAnimating: true }, () =>
      console.log(this.state)
    );
  };
  handleInterviewPhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ interviewPhase: parseInt(e.currentTarget.value) }, () =>
      console.log(this.state)
    );
  };

  handleInterviewPostContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ postContent: e.target.value }, () =>
      console.log(this.state)
    );
  };

  handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ company: e.target.value }, () => console.log(this.state));
  };

  handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ position: e.target.value }, () => console.log(this.state));
  };

  render() {
    return (
      <Container>
        <form>
          <label htmlFor="exampleInputPost">New Post</label>
          <div>
            <small
              id="postHelp"
              className="form-text text-muted text-left"
              style={{ height: '1rem', marginLeft: '1rem' }}
            >
              <img
                src={require('../../assets/lock-icon.svg')}
                alt=""
                style={{
                  maxHeight: '80%',
                  marginRight: '4px',
                  verticalAlign: 'text-top',
                }}
              />
              All shared information is anonymous
            </small>
          </div>
          <InputContainer className="form-group">
            <PostContainer
              onAnimationEnd={() => {
                this.setState({ isAnimating: false });
              }}
              className={
                this.state.isAnimating
                  ? this.state.stage === Stage.Post
                    ? 'cd-enter-left selected'
                    : 'cd-leave-left'
                  : this.state.stage === Stage.Post
                  ? 'selected'
                  : ''
              }
            >
              <TextArea
                className="form-text"
                id="exampleInputPost"
                aria-describedby="postHelp"
                minLength={10}
                rows={4}
                placeholder="Share your interview info..."
                onChange={this.handleInterviewPostContentChange}
              />
              <Select
                onChange={this.handleInterviewPhaseChange}
                value={this.state.interviewPhase}
                style={{ padding: '1rem 0', width: 'fit-content' }}
                className="form-select"
              >
                <option value="0" disabled>
                  Open this to select interview phase
                </option>
                <option value="1">OA</option>
                <option value="2">VO (technical) </option>
                <option value="3">VO (BQ) </option>
                <option value="4">offer</option>
                <option value="-1">other</option>
              </Select>
            </PostContainer>
            <PositionContainer
              onAnimationEnd={() => {
                this.setState({ isAnimating: false });
              }}
              className={
                this.state.isAnimating
                  ? this.state.stage === Stage.Position
                    ? 'cd-enter-right selected'
                    : 'cd-leave-right'
                  : this.state.stage === Stage.Position
                  ? 'selected'
                  : ''
              }
            >
              <button
                onClick={this.handlePrevButtonClick}
                type="button"
                className="btn btn-link"
                style={{ padding: '0' }}
              >
                &lt; Prev
              </button>

              <label htmlFor="company" style={{ margin: '1rem 0' }}>
                Company
              </label>
              <Input
                type="text"
                id="company"
                name="company"
                placeholder="Enter the company..."
                minLength={1}
                size={30}
                style={{ fontSize: '1rem' }}
                onChange={this.handleCompanyChange}
              />
              <label htmlFor="position" style={{ margin: '1rem 0' }}>
                Position
              </label>
              <Input
                type="text"
                id="position"
                name="position"
                placeholder="Enter the position..."
                minLength={1}
                size={30}
                style={{ fontSize: '1rem' }}
                onChange={this.handlePositionChange}
              />
            </PositionContainer>
          </InputContainer>
          <SubmitContainer>
            <button
              onClick={this.handleSubmitButtonClick}
              type="button"
              className="btn btn-primary float-right m-2"
              style={{ minWidth: '90px' }}
            >
              {this.state.stage === Stage.Post ? 'Submit >' : 'Finish '}
            </button>
          </SubmitContainer>
        </form>
      </Container>
    );
  }
}
 

export default Post;
