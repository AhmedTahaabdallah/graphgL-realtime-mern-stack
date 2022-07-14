const { gql } = require('apollo-server-express');

const typeDefs = gql`
    #type
    type Post {
        _id: ID!
        content: String
        image: Image
        postedBy: User
    }

    # queries
    type Query {
        totalPosts: Int!
        allPosts(page: Int): [Post!]!
        postsByUser: [Post!]!
        singlePost(postId: String!): Post!
        search(query: String!): [Post!]!
    }

    # input type
    input PostCreateInput {
        content: String!
        image: ImageInput!
    }

    input PostUpdateInput {
        _id: String!
        content: String!
        image: ImageInput!
    }

    # mutations
    type Mutation {
        postCreate(input: PostCreateInput!): Post!
        postUpdate(input: PostUpdateInput!): Post!
        postDelete(postId: String!): Post!
    }

    # subscriptions
    type Subscription {
        postAdded: Post
        postUpdated: Post
        postDeleted: Post
    }
`;

module.exports = typeDefs;