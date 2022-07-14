import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { SINGLE_POST } from "../../gql/queries";
import { getNewSinglePost } from "../../helpers/utils";
import { useParams } from "react-router-dom";
import PostCard from "../../components/PostCard";

const SinglePost = props => {
    const { postId } = useParams();

    const [isFirstTimeMemo, setIsFirstTimeMemo] = useState(false);
    const [values, setValues] = useState({
        content: '',
        image: {
            url: '',
            public_id: ''
        }
    });

    const { data: singlePost, loading: singlePostLoading, error: singlePostError } = useQuery(SINGLE_POST, { variables: { postId } });

    useMemo(() => {
        if (singlePost && !isFirstTimeMemo) {
            setIsFirstTimeMemo(true);
            const newSinglePost = getNewSinglePost(singlePost.singlePost);
            setValues({
                ...values,
                ...newSinglePost
            });
        }
    }, [singlePost, isFirstTimeMemo, values]);

    if (singlePostLoading) (<div>Loading...</div>);
    if (singlePostError) (<div>{singlePostError}</div>);
    return <div className="container p-5">  
        <PostCard post={values} isSinglePost/>
    </div>;
};

export default SinglePost;