import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Outlet } from "react-router-dom";
import LoadingToRedirect from "./LoadingToRedirect";

const PrivateRoute = props => {
    const { state } = useContext(AuthContext);
    const { user } = state;
    const { path } = props;
    
    return user ? <Outlet /> : <LoadingToRedirect path={path} />;
};

export default PrivateRoute;