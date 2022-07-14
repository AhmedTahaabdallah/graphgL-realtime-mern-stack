const { gql } = require('apollo-server-express');

const typeDefs = gql`
    # scalar type
    scalar DateTime
    scalar JSON
    # custom type
    type Image {
        url: String
        public_id: String
    }

    type User {
        _id: ID
        userName: String
        name: String
        email: String
        images: [Image]
        about: String
        createdAt: DateTime
        updatedAt: DateTime
    }

    type userCreateResponse {
        userName: String!
        email: String!
    }

    # input type
    input ImageInput {
        url: String
        public_id: String
    }

    input UserUpdateInput {
        userName: String
        email: String
        name: String
        images: [ImageInput]
        about: String
    }

    type Query {
        profile: User!
        publicProfile(userName: String!): User
        allUsers: [User!]
    }

    type Mutation {
        userCreate: userCreateResponse!
        userUpdate(input: UserUpdateInput): User!
    }
`;

module.exports = typeDefs;