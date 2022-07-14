import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { POST_UPDATE } from "../../gql/mutations";
import { SINGLE_POST } from "../../gql/queries";
import { getNewSinglePost } from "../../helpers/utils";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../../components/forms/PostForm";

const PostUpdate = props => {
    const navigate = useNavigate(); 
    const { postId } = useParams();

    const [isFirstTimeMemo, setIsFirstTimeMemo] = useState(false);
    const [values, setValues] = useState({
        content: '',
        image: {
            url: '',
            public_id: ''
        }
    });
    const [uploadImageLoading, setUploadImageLoading] = useState(false);

    const { data: singlePost, loading: singlePostLoading, error: singlePostError } = useQuery(SINGLE_POST, { variables: { postId } });

    const [postUpdate, {  
        loading: postUpdateLoading, 
        reset: postUpdateReset
    }] = useMutation(POST_UPDATE);

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

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newValues = {...values};
        delete newValues.postedBy;
        await postUpdate({
            variables: { input: newValues },
            onError: (err) => {
                const errorMessage = err.networkError &&  err.networkError.result && err.networkError.result.errors ?
                err.networkError.result.errors[0].message : null;
                toast.error(errorMessage || err.message);
                postUpdateReset();
            },
            onCompleted: (data) => {
                toast.success('Post Updated.');
                postUpdateReset();
                navigate(`/post/create`)
            },
        });
    };

    if (singlePostLoading) (<div>Loading...</div>);
    if (singlePostError) (<div>{singlePostError}</div>);
    return <div className="container p-5">  
        <PostForm
        {...values}
        //loading={loading}
        newPostLoading={postUpdateLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setUploadImageLoading={setUploadImageLoading}
        setValues={setValues}
        values={values} 
        uploadImageLoading={uploadImageLoading}
        />
    </div>;
};

export default PostUpdate;