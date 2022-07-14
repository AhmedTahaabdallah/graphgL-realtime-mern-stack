import React from "react";
import { useSearchParams } from "react-router-dom";
import {
    useQuery
} from "@apollo/client";
import { SEARCH } from "../gql/queries";
import PostCard from "./PostCard";

const SearchResults = props => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const { data, loading, error } = useQuery(SEARCH, {
        variables: { query }
    });
    
    if (loading) 
    return <div className="text-center mt-5">
        <p>Loading...</p>
    </div>;
    //console.log(error.statusCode)
    if (error) 
    return <div className="text-center mt-5">
        <p className="text-danger">Error : {error.message}</p>
    </div>;

    if (data && data.search && data.search.length === 0) 
    return <div className="text-center mt-5">
        <p className="text-danger">No Result({query})</p>
    </div>;

    return (
        <div className="container">
            <div className="row p-5">
                {
                    data && data.search.map(post => <PostCard key={post._id} post={post} />)
                }
            </div>
        </div>
    );
};

export default SearchResults;