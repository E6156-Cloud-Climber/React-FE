import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { gen_url } from '../../conn';
import {
  Container,
  Retweeted,
  RocketseatIcon,
  Body,
  Avatar,
  Content,
  Header,
  Dot,
  Description,
  ImageContent,
  Icons,
  Status,
  CommentIcon,
  RetweetIcon,
  LikeIcon,
} from './styles';
import { nextTick } from 'process';
import Post from '../Post';

interface UserType {
  avatar: string;
  company: string;
  position: string;
  phase: string;
  posttime: string;
  posttext: string;
}
interface PostType {
  phase_name: string;
  position_name: string;
  company_name: string;
  description: string;
  updated_at: string;
}

interface PropsType {}

const Tweet: React.FC<PropsType> = () => {
  const [likeCounter, setLikeCounter] = useState(0);
  const [posts, setPosts] = useState<Array<PostType>>([]);

  // validate
  // 1. remove empty posts
  const validatePosts = (posts: Array<PostType>) => {
    posts.map((post, index) => {
      if (post.description === '') {
        posts.splice(index, 1);
      }
    });
  };

  useEffect(() => {
    fetch(gen_url('/composite/posts'))
      .then((resp) => resp.json())
      .then((res) => {
        validatePosts(res.posts);
        setPosts(res.posts);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {posts.map((post, index) => (
        <Container key={index}>
          {/* {post.retweet ? (
            <Retweeted>
              <RocketseatIcon />
              You retweeted
            </Retweeted>
          ) : (
            ''
          )} */}

          <Body>
            {/* <Avatar>
              <img src={post.avatar} alt={post.company} />
            </Avatar> */}

            <Content>
              <Header>
                <strong>{post.company_name}</strong>
                <span title={post.position_name}>{post.position_name}</span>
                <Dot />
                <span title={post.phase_name}>{post.phase_name}</span>
                <Dot />
                <time>{moment(post.updated_at).fromNow()}</time>
              </Header>

              <Description>{post.description}</Description>

              {/* <ImageContent>
                {post.postimage ? (
                  <img src={post.postimage} alt="Imge Post" />
                ) : (
                  ''
                )}
              </ImageContent> */}

              {/* <Icons>
                <Status>
                  <CommentIcon />
                  {post.commentscount}
                </Status>
                <Status>
                  <RetweetIcon />
                  {post.retweetscount}
                </Status>
                <Status onClick={() => setLikeCounter(likeCounter + 1)}>
                  <LikeIcon />
                  {post.likecount + likeCounter}
                </Status>
              </Icons> */}
            </Content>
          </Body>
        </Container>
      ))}
    </>
  );
};

export default Tweet;
