import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingToRedirect = props => {
    const [count, setCount] = useState(5);
    const { path } = props;
    const navigate = useNavigate();
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(currentCount => --currentCount);
        }, 1000);
        count === 0 && navigate(path);
        return () => clearInterval(interval);
    }, [count, navigate, path]);

    return (
        <div
        className="container p-5 text-center">
            <p>Redirecting you in {count} seconds.</p>
        </div>
    );
};

export default LoadingToRedirect;