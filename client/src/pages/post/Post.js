import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import PostForm from "../../components/forms/PostForm";
import { CREATE_POST, POST_DELETE } from "../../gql/mutations";
import { POSTS_BY_USER } from "../../gql/queries";
import PostCard from "../../components/PostCard";

const initState = {
    content: '',
    image: null,
};

const Post = props => {
    const [createPost, {  
        loading: newPostLoading, 
        reset: createPostReset
    }] = useMutation(CREATE_POST);

    const [postDelete, {  
        loading: postDeleteLoading, 
        reset: postDeleteReset
    }] = useMutation(POST_DELETE, {
        onError: (err) => {
            const errorMessage = err.networkError &&  err.networkError.result && err.networkError.result.errors ?
            err.networkError.result.errors[0].message : null;
            toast.error(errorMessage || err.message);
            postDeleteReset();
        },
        onCompleted: (data) => {
            console.log(data);
            toast.success('Post Deleted.');
            postDeleteReset();
        },
        update: (cache, { data }) => {
            console.log('update delete post : ', data);
        }
    });

    const [values, setValues] = useState(initState);
    const [uploadImageLoading, setUploadImageLoading] = useState(false);

    const { data: posts, loading: allPostsLoading, error: allPostsError } = useQuery(POSTS_BY_USER);

    const handleSubmit = async(e) => {
        e.preventDefault();
        await createPost({
            variables: { input: values },
            onError: (err) => {
                const errorMessage = err.networkError &&  err.networkError.result && err.networkError.result.errors ?
                err.networkError.result.errors[0].message : null;
                toast.error(errorMessage || err.message);
                createPostReset();
            },
            onCompleted: (data) => {
                //const { postCreate } = data;
                //const newPost = getNewProfileObject(postCreate);
                // console.log(postCreate);
                // console.log(newPost);
                setValues(initState);
                toast.success('Post Crated.');
                createPostReset();
            },
            update: (cache, { data: postCreate }) => {
                const { postsByUser } = cache.readQuery({
                    query: POSTS_BY_USER
                });
                cache.writeQuery({
                    query: POSTS_BY_USER,
                    data: {
                        postsByUser: [postCreate.postCreate, ...postsByUser]
                    }
                });
            }
        });
    };

    const handlePostDelete = async(postId) => {
        const answer = window.confirm('Delete ?');

        if (answer) await postDelete({
            variables: {
                postId
            },
            refetchQueries: [{ query: POSTS_BY_USER }]
        });
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };
    return <div className="container p-5">        
    <PostForm 
    {...values}
    //loading={loading}
    newPostLoading={newPostLoading}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    setUploadImageLoading={setUploadImageLoading}
    setValues={setValues}
    values={values} 
    uploadImageLoading={uploadImageLoading}
    />
    <hr/>
    <div className="row mt-5">
        {
            !allPostsLoading && !allPostsError && posts && posts.postsByUser &&
            posts.postsByUser.map(post => 
            <PostCard key={post._id} post={post} 
            showUpdateButton={true}
            showDeleteButton={true} 
            postDeleteLoading={postDeleteLoading}
            handlePostDelete={handlePostDelete} />)
        }
    </div>
</div>;
};

export default Post;