import React from "react";
import { Link } from "react-router-dom";
import Image from "./Image";

const UserCard = props => {
    const { 
        user
    } = props;
    return (
        <div className='col-md-4'>
            <div className='card text-center' style={{ minHeight: '375px'}}>
                <div className="card-body">
                    <Image url={user.images[0].url}/>   
                    <Link to={`/user/${user.userName}`}>
                        <h4 className="text-primary">@{user.userName}</h4> 
                    </Link>                          
                    <hr/>
                    <small>{user.about}</small>                     
                </div>
            </div>
        </div>
    );
};

export default UserCard;