import { gql } from '@apollo/client';
import { USER_INFO, POST_DATA } from './fragment';

export const USER_CREATE = gql`
    mutation {
        userCreate {
        userName
        email
        }
    }
`;

export const UPDATE_PROFILE = gql`
    mutation UserUpdate($input: UserUpdateInput) {
        userUpdate(input: $input) {
            ...userInfo
        }
    }
    ${USER_INFO}
`;

export const CREATE_POST = gql`
    mutation postCreate($input: PostCreateInput!) {
        postCreate(input: $input) {
            ...postData
        }
    }
    ${POST_DATA}
`;

export const POST_DELETE = gql`
    mutation postDelete($postId: String!) {
        postDelete(postId: $postId) {
            _id
        }
    }
`;

export const POST_UPDATE = gql`
    mutation postUpdate($input: PostUpdateInput!) {
        postUpdate(input: $input) {
            ...postData
        }
    }
    ${POST_DATA}
`;