import React from "react";
import {
    useQuery,
} from "@apollo/client";
import { PUBLIC_PROFILE } from "../gql/queries";
import { useParams } from "react-router-dom";
import Image from "../components/Image";

const SingleUser = () => {
    const params = useParams();
    const { data, loading, error } = useQuery(PUBLIC_PROFILE, {
        variables: {
            userName: params.userName
        }
    });
    
    if (loading) return <p>Loading...</p>;
    //console.log(error.statusCode)
    if (error) return <p>Error : {error.message}</p>;
    if (!data.publicProfile) return <p className="text-center mt-5">User Not Found!</p>;
    const user = {...data.publicProfile};    
    return <div className="container">
        <div className='card text-center' style={{ minHeight: '375px'}}>
            <div className="card-body">
                <Image url={user.images[0].url}/>   
                <h4 className="text-primary">@{user.userName}</h4>                     
                <h5 className="text-info">{user.email}</h5>                     
                <h5 className="text-Dark">{user.name}</h5>                     
                <hr/>
                <small>{user.about}</small>                     
            </div>
        </div> 
    </div>;
};

export default SingleUser;