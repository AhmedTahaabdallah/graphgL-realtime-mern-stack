import React, { useState, useRef, useContext, useEffect } from "react";
import { 
    auth, googleAuthProvider, 
    signInWithPopup2, signInWithEmailAndPassword2 
} from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useMutation } from "@apollo/client";
import { USER_CREATE } from "../../gql/mutations";
import AuthForm from "../../components/forms/AuthForm";

const Login = props => {
    const [userCreate] = useMutation(USER_CREATE);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const email = useRef('');
    const password = useRef('');

    useEffect(() => {
        return () => {
            setLoading(null);
          };
    }, []);

    const createNewUser = async(token) => {
        await userCreate({
            variables: {},
            onError: (err) => {
                const errorMessage = err.networkError &&  err.networkError.result && err.networkError.result.errors ?
                err.networkError.result.errors[0].message : null;
                toast.error(errorMessage || err.message);
            },
            onCompleted: (data) => {
                if (data.userCreate) {
                    toast.success('Login Success.');
                    navigate('/profile');
                }                        
            },
            context: {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            },
        });   
    };

    const submitHandler = async(e) => {
        e.preventDefault();
        const emailValue = email.current.value;
        const passwordValue = password.current.value;
        if (!email || !passwordValue || passwordValue.trim().length === 0) {
            toast.error('Email and Password are required.');
            return;
        }
        try {            
            setLoading(true);
            const result = await signInWithEmailAndPassword2(auth, emailValue, passwordValue);
            if (result.user) {
                const user = result.user;

                const idTokenResult = await user.getIdTokenResult();
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });
                
                await createNewUser(idTokenResult.token);             
            }            
            setLoading(false);
        } catch (error) {
            console.log("Login error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    const googleLogin = async() => {
        try {
            const result = await signInWithPopup2(auth, googleAuthProvider);
            const user = result.user;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type: 'LOGGED_IN_USER',
                payload: { email: user.email, token: idTokenResult.token }
            });
            await createNewUser(idTokenResult.token); 
        } catch (error) {
            console.log("googleLogin error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthForm 
        formTitle='Login' 
        submitHandler={submitHandler} 
        email={email}
        password={password} 
        loading={loading} 
        buttonTitle='Login'  
        googleLogin={googleLogin}
        showForgotPassword={true}
        />
    );
};

export default Login;