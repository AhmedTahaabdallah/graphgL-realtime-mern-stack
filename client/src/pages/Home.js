import React, { useState } from "react";
import {
    useQuery,
    useSubscription,
    useLazyQuery
} from "@apollo/client";
import { ALL_POSTS, TOTAL_POSTS } from "../gql/queries";
import { POST_ADDED, POST_UPDATED, POST_DELETED } from "../gql/subscriptions";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination";

const Home = () => {
    const [page, setPage] = useState(1);
    const { data: postCount } = useQuery(TOTAL_POSTS);
    const { data: newPost } = useSubscription(POST_ADDED, {
        onSubscriptionData: async({ client: {cache}, subscriptionData: {data}}) => {
            const { allPosts } = cache.readQuery({
                query: ALL_POSTS,
                variables: { page }
            });
            cache.writeQuery({
                query: ALL_POSTS,
                variables: { page },
                data: {
                    allPosts: [data.postAdded, ...allPosts]
                }
            });
            fetchPosts({
                variables: { page },
                refetchQueries: [{query: ALL_POSTS, variables: { page }}]
            });
        }
    });
    const { data: updatedPost } = useSubscription(POST_UPDATED);
    const { data: deletedPost } = useSubscription(POST_DELETED, {
        onSubscriptionData: async({ client: {cache}, subscriptionData: {data}}) => {
            const { allPosts } = cache.readQuery({
                query: ALL_POSTS,
                variables: { page }
            });
            cache.writeQuery({
                query: ALL_POSTS,
                variables: { page },
                data: {
                    allPosts: allPosts.filter(p => p._id !== data.postDeleted._id)
                }
            });
            fetchPosts({
                variables: { page },
                refetchQueries: [{query: ALL_POSTS}]
            });
        }
    });
    const { data, loading, error } = useQuery(ALL_POSTS, {
        variables: { page }
    });
    const [fetchPosts, { data: posts }] = useLazyQuery(ALL_POSTS);
    
    if (loading) return <p>Loading...</p>;
    //console.log(error.statusCode)
    if (error) return <p>Error : {error.message}</p>;
  
    return <div className="container">
        <div className="row p-5">
            {
                data && data.allPosts.map(post => <PostCard key={post._id} post={post} />)
            }
        </div>
                 
        <PostPagination
        postCount={postCount} page={page} setPage={setPage}
        />
    </div>;
};

export default Home;