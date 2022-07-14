import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "./Image";

const PostCard = props => {
    const navigate = useNavigate(); 

    const { 
        post,
        isSinglePost,
        showUpdateButton,
        showDeleteButton
    } = props;
    return post && (
        <div className={!isSinglePost ? 'col-md-4 mb-3' : ''} key={post._id}>
            <div className='card text-center' style={{ minHeight: '375px'}}>
                <div className="card-body">
                    {post.image && post.image.url && <Link to={`/post/${post._id}`}>
                        <Image url={post.image.url}/>
                    </Link>}   
                    {
                        post.postedBy && post.postedBy.userName &&
                        <Link to={`/user/${post.postedBy.userName}`}>
                            <h4 className="text-primary">@{post.postedBy.userName}</h4> 
                        </Link>  
                    }                        
                    <hr/>
                    <small>{post.content}</small>       
                    <br/>              
                    <br/> 
                    {
                        showDeleteButton !== null && showUpdateButton === true &&
                        <button className="btn m-2 btn-danger" onClick={() => props.handlePostDelete(post._id)}>Delete</button>
                    }  
                    {
                        showUpdateButton !== null && showUpdateButton === true &&
                        <button className="btn m-2 btn-warning"
                        onClick={() => navigate(`/post/update/${post._id}`)}
                        >Update</button>
                    }             
                </div>
            </div>
        </div>
    );
};

export default PostCard;