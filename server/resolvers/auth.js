const shortid = require('shortid');
const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const GraphQLJSON = require('graphql-type-json');
const { DateTimeResolver } = require('graphql-scalars');

const profile = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    const user = await User.findOne({ email: currentUser.email });
    return user ? user : new User({
        email: currentUser.email,
        userName: shortid.generate()
    }).save();
};

const publicProfile = async(_, args, { req }) => {
    return await User.findOne({ userName: args.userName }).exec();
};

const allUsers = async(_, args) => await User.find({}).exec();

const userCreate = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    const user = await User.findOne({ email: currentUser.email });
    return user;
};

const userUpdate = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    const updatedUser = await User.findOneAndUpdate(
        { email: currentUser.email },
        { ...args.input },
        { new: true }
    ).exec();
    return updatedUser;
};

const authResolvers = {
    JSON: GraphQLJSON,
    Query: {
        profile,
        publicProfile,
        allUsers
    },
    Mutation: {
        userCreate,
        userUpdate
    }
};

module.exports = authResolvers;