const { ApolloServer } = require('apollo-server');
require('dotenv').config();

const typeDefs = `
    type Query {
        totalPosts: Int!
    }
`;

const resolvers = {
    Query: {
        totalPosts: () => 42
    }
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.listen(process.env.PORT, () => {
    console.log(`apolloServer is ready at http:/localhost:${process.env.PORT}`);
});