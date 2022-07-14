import React from "react";
import {
    useQuery,
} from "@apollo/client";
import { ALL_USERS } from "../gql/queries";
import UserCard from "../components/UserCard";

const Users = () => {
    const { data, loading, error } = useQuery(ALL_USERS);
    
    if (loading) return <p>Loading...</p>;
    //console.log(error.statusCode)
    if (error) return <p>Error : {error.message}</p>;
  
    return <div className="container">
        <div className="row p-5">
            {
                data && data.allUsers.map(user => <UserCard key={user._id} user={user}/>)
            }
        </div>   
    </div>;
};

export default Users;