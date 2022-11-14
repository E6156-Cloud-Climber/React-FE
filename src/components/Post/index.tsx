import * as React from 'react';
import { Component } from 'react';
import { Container } from './styles';

const Post = () => {
  return (
    <Container>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputPost">New Post</label>
          <input
            type="post"
            className="form-control"
            id="exampleInputPost"
            aria-describedby="postHelp"
            placeholder="Share your interview info..."
          />
          <small id="postHelp" className="form-text text-muted">
            All shared information is anonymous
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Container>
  );
};

export default Post;
