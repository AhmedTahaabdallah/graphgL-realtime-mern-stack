const { authCheck } = require('../helpers/auth');
const User = require('../models/user');
const Post = require('../models/post');
// const { DateTimeResolver } = require('graphql-scalars');
const { PubSub }  = require('graphql-subscriptions');

const pubsub = new PubSub();

const POST_ADDED = 'POST_ADDED';
const POST_UPDATED = 'POST_UPDATED';
const POST_DELETED = 'POST_DELETED';

const allPosts = async(_, args) => {
    const currentPage = args.page || 1;
    const perPage = 3;
    return await Post.find({})
    .skip((currentPage - 1) * perPage)
    .limit( perPage)
    .populate('postedBy', '_id userName')
    .sort({ createdAt: -1 })
    .exec();
};

const postsByUser = async(_, args, { req }) => {    
    const currentUser = await authCheck(req);
    const currentUserFromDB = await User.findOne({ email: currentUser.email }).exec();
    return await Post.find({
        postedBy: currentUserFromDB._id
    })
    .populate('postedBy', '_id userName')
    .sort({ createdAt: -1 })
    .exec();
};

const postCreate = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    if (args.input.content.trim() === '') throw new Error('Content is Require!');
    const currentUserFromDB = await User.findOne({ email: currentUser.email }).exec();
    const newPost = await new Post({
        ...args.input,
        postedBy: currentUserFromDB._id
    })
    .save()
    .then(post => post.populate('postedBy', '_id userName'));
    pubsub.publish(POST_ADDED, { postAdded: newPost });
    return newPost;
};

const singlePost = async(_, args, { req }) => {
    return await Post.findById(args.postId)
    .populate('postedBy', '_id userName')
    .exec();
};

const postUpdate = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    if (args.input.content.trim() === '') throw new Error('Content is Require!');
    const currentUserFromDB = await User.findOne({ email: currentUser.email }).exec();
    const postToUpdate = await Post.findById(args.input._id).exec();
    if (currentUserFromDB._id.toString() !== postToUpdate.postedBy.toString()) {
        throw new Error('Unauthorized action');
    }
    const updatePost = await Post.findByIdAndUpdate(args.input._id, { ...args.input }, {new: true}).exec()
    .then(post => post.populate('postedBy', '_id userName'));
    pubsub.publish(POST_UPDATED, { postUpdated: updatePost });
    return updatePost;
};

const postDelete = async(_, args, { req }) => {
    const currentUser = await authCheck(req);
    const currentUserFromDB = await User.findOne({ email: currentUser.email }).exec();
    const postToDelete = await Post.findById(args.postId).exec();
    console.log(postToDelete);
    if (currentUserFromDB._id.toString() !== postToDelete.postedBy.toString()) {
        throw new Error('Unauthorized action');
    }
    const deletePost = await Post.findByIdAndDelete(args.postId).exec();
    pubsub.publish(POST_DELETED, { postDeleted: deletePost });
    return deletePost;
};

const totalPosts = async(_, args, { req }) => 
await Post.find({}).estimatedDocumentCount().exec();

const search = async(_, args, { req }) => 
await Post.find({ 'content': { $regex: args.query, $options: 'i' } }, )
.populate('postedBy', '_id userName')
.exec();

const postResolvers = {
    Query: {
        totalPosts,
        allPosts,
        postsByUser,
        singlePost,
        search
    },
    Mutation: {
        postCreate,
        postUpdate,
        postDelete
    },
    Subscription: {
        postAdded: {
            subscribe: () => pubsub.asyncIterator([POST_ADDED])
        },
        postUpdated: {
            subscribe: () => pubsub.asyncIterator([POST_UPDATED])
        },
        postDeleted: {
            subscribe: () => pubsub.asyncIterator([POST_DELETED])
        },
    }
};

module.exports = postResolvers;