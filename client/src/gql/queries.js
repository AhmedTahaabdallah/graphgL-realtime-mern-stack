import { gql } from '@apollo/client';
import { USER_INFO, POST_DATA } from './fragment';

export const TOTAL_POSTS = gql`
    query Query {
      totalPosts
    }
`;

export const ALL_POSTS = gql`
    query allPosts($page: Int) {
        allPosts(page: $page) {
          ...postData
        }
      }
    ${POST_DATA}
`;

export const POSTS_BY_USER = gql`
    query Query {
      postsByUser {
          ...postData
        }
      }
    ${POST_DATA}
`;

export const ALL_USERS = gql`
    query Query {
      allUsers {
          _id
          userName
          images {
            url
          }
          about
        }
      }
`;

export const PUBLIC_PROFILE = gql`
    query PublicProfile($userName: String!) {
      publicProfile(userName: $userName) {
        ...userInfo
      }
    }
    ${USER_INFO}
`;

export const PROFILE = gql`
  query Profile {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;

export const SINGLE_POST = gql`
    query singlePost($postId: String!) {
      singlePost(postId: $postId) {
        ...postData
      }
    }
    ${POST_DATA}
`;

export const SEARCH = gql`
    query search($query: String!) {
      search(query: $query) {
        ...postData
      }
    }
    ${POST_DATA}
`;