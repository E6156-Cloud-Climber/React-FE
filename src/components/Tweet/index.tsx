import React, { useEffect, useState, useRef } from 'react';
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
  MyPaginate,
} from './styles';
import { nextTick } from 'process';
import Post from '../Post';
import ReactPaginate from 'react-paginate';

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
  const postRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<Array<PostType>>([]);
  const [postCounter, setPostCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  // validate
  // 1. remove empty posts
  const validatePosts = (posts: Array<PostType>) => {
    posts.map((post, index) => {
      // if (!post.description) {
      //   post.description = 'No description'
      // }
    });
  };
  const paginate = (selectedItem: { selected: number }) => {
    postRef?.current?.scrollIntoView();
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    fetch(
      gen_url('/composite/posts', 0, { page: currentPage, limit: postsPerPage })
    )
      .then((resp) => resp.json())
      .then((res) => {
        validatePosts(res.posts);
        setPosts(res.posts);
        setPostCounter(res.total);
      })
      .catch((err) => console.log(err));
  }, [currentPage, postsPerPage]);

  return (
    <>
      {posts.length ? (
        posts.map((post, index) => (
          <Container ref={postRef} key={index}>
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
        ))
      ) : (
        <h1 className="loading"> Loading...</h1>
      )}
      <MyPaginate
        onPageChange={paginate}
        pageCount={Math.ceil(postCounter / postsPerPage)}
        previousLabel={'Prev'}
        nextLabel={'Next'}
        // containerClassName={'pagination'}
        // pageLinkClassName={'page-number'}
        // previousLinkClassName={'page-number'}
        // nextLinkClassName={'page-number'}
        // activeLinkClassName={'active'}
      />
    </>
  );
};

export default Tweet;
