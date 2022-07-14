import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = props => {
    const { state } = useContext(AuthContext);
    const { user } = state;
    
    return !user ? <Outlet /> : <Navigate to="/profile" />;
};

export default PublicRoute;