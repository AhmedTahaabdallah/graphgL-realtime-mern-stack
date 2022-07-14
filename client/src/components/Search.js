import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = props => {
    const navigate = useNavigate(); 

    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${query}`);
    };

    return (
        <form className="d-flex input-group w-auto"
        onSubmit={handleSubmit}>
            <input
            type="search"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            />
            <button
            className="btn btn-outline-primary"
            type="submit"
            data-mdb-ripple-color="dark"
            >
            Search
            </button>
        </form>
    );
};

export default Search;