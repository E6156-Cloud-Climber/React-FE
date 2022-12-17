import * as React from 'react';
import { gen_url } from '../../conn';
import { getUserID } from '../../getUserID';
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
  interviewPhaseId: number;
  postContent: string;
  company: string;
  position: string;
  stage: Stage;
  isAnimating: boolean;
  phases: Array<Phase>;
  types: Array<Type>;
  selectedType: number;
  year: number;
}

interface Phase {
  id: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
}

class Post extends React.Component<PostProps, PostState> {
  state: PostState = {
    interviewPhaseId: 0,
    postContent: '',
    company: '',
    position: '',
    stage: Stage.Post,
    isAnimating: false,
    phases: [],
    selectedType: 1,
    year: 2022,
    types: [
      { id: 1, name: 'Full-Time' },
      { id: 2, name: 'Part-Time' },
      { id: 3, name: 'Contractor' },
      { id: 4, name: 'Intership' },
    ],
  };

  getValidateInput = (input: PostState) => {
    return {
      company_name: input.company.trim(),
      position_name: input.position.trim(),
      phase_id: input.interviewPhaseId,
      description: input.postContent.trim(),
      position_type: input.selectedType,
      year: input.year,
    };
  };

  resetUserInput = () => {
    this.setState({
      interviewPhaseId: 0,
      postContent: '',
      company: '',
      position: '',
      stage: Stage.Post,
      isAnimating: true,
    });
  };

  handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.stage === Stage.Post) {
      if (this.state.postContent.trim() === '') {
        alert('Empty post content!');
      } else if (this.state.interviewPhaseId === 0) {
        alert('Please select interview phase!');
      } else {
        this.setState({ stage: Stage.Position, isAnimating: true });
      }
    } else if (this.state.stage === Stage.Position) {
      if (this.state.company.trim() === '') {
        alert('Please enter the company!');
      } else if (this.state.position.trim() === '') {
        alert('Please enter the position!');
      } else {
        let input = this.getValidateInput(this.state);
        let user_id = getUserID();
        console.log('user_id:', user_id);
        fetch(gen_url(`/composite/posts/${user_id}`), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        })
          .then((resp) => resp.json())
          .then((res) => {
            console.log(res);
            if ('post_id' in res) {
              this.resetUserInput();
              alert('Done!');
            }
          })
          .catch((err) => {
            console.log(err);
            alert('Ops! Something is wrong!');
          });
      }
    } else {
      throw Error(`Invalid Stage=${this.state.stage}`);
    }
  };

  handlePrevButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ stage: Stage.Post, isAnimating: true }, () =>
      console.log(this.state)
    );
  };
  handleinterviewPhaseIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ interviewPhaseId: parseInt(e.currentTarget.value) }, () =>
      console.log(this.state)
    );
  };

  handleSelectedTypeIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedType: parseInt(e.currentTarget.value) }, () =>
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

  handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ year: parseInt(e.target.value) }, () =>
      console.log(this.state)
    );
  };

  componentDidMount() {
    fetch(gen_url('/phases', 3))
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ phases: res });
      });
  }

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
                value={this.state.postContent}
                placeholder="Share your interview info..."
                onChange={this.handleInterviewPostContentChange}
              />
              <Select
                onChange={this.handleinterviewPhaseIdChange}
                value={this.state.interviewPhaseId}
                style={{ padding: '1rem 0', width: 'fit-content' }}
                className="form-select"
              >
                <option value="0" disabled>
                  Open this to select interview phase
                </option>
                {this.state.phases.map(({ id, name }) => (
                  <option value={id}>{name}</option>
                ))}
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
              <label htmlFor="year" style={{ margin: '1rem 0' }}>
                Estimated Onboard Year
              </label>
              <Input
                type="number"
                min="1900"
                max="2099"
                step="1"
                id="year"
                name="year"
                placeholder="Enter the year..."
                style={{ fontSize: '1rem' }}
                value={this.state.year}
                onChange={this.handleYearChange}
              />
              <label htmlFor="type" style={{ margin: '1rem 0' }}>
                Job Type
              </label>

              <Select
                onChange={this.handleSelectedTypeIdChange}
                value={this.state.selectedType}
                style={{ padding: '1rem 0', width: 'fit-content' }}
                className="form-select"
              >
                <option value="0" disabled>
                  Open this to select job type
                </option>
                {this.state.types.map(({ id, name }) => (
                  <option value={id}>{name}</option>
                ))}
              </Select>
            </PositionContainer>
          </InputContainer>
          <SubmitContainer>
            <button
              onClick={this.handleSubmitButtonClick}
              type="button"
              className="btn btn-primary float-right m-2"
              style={{ minWidth: '90px' }}
            >
              {this.state.stage === Stage.Post ? 'Next >' : 'Finish '}
            </button>
          </SubmitContainer>
        </form>
      </Container>
    );
  }
}

export default Post;
