import React, { useState, useRef, useContext, useEffect } from "react";
import { auth, signInWithEmailLink2, updatePassword2 } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useMutation } from '@apollo/client';
import { USER_CREATE } from "../../gql/mutations";
import AuthForm from "../../components/forms/AuthForm";

const  CompleteRegistration = props => {
    const [userCreate] = useMutation(USER_CREATE);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    
    const params = new URLSearchParams(window.location.search);    
    const sEmail = params.get('email') || '';
    
    const email = useRef();
    const password = useRef();

    useEffect(() => {
        email.current.value = sEmail;
    }, [ email, sEmail ]);

    const submitHandler = async(e) => {
        e.preventDefault();
        const passwordValue = password.current.value;
        if (!email || !passwordValue || passwordValue.trim().length === 0) {
            toast.error('Email and Password are required.');
            return;
        }
        try {            
            setLoading(true);
            const result = await signInWithEmailLink2(auth, sEmail, window.location.href);
            if (result.user.emailVerified) {
                const user = auth.currentUser;
                await updatePassword2(user, passwordValue);

                const idTokenResult = await user.getIdTokenResult();
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });
                await userCreate({}, {
                    context: {
                        headers: {
                            "Authorization": `Bearer ${idTokenResult.token}`
                        }
                    },
                });
                navigate('/profile');
            }            
            setLoading(false);
        } catch (error) {
            console.log("CompleteRegistration error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthForm
        formTitle='Complete Your Registration' 
        submitHandler={submitHandler} 
        email={email}
        disableEmail={true}
        password={password} 
        loading={loading} 
        buttonTitle='Complete Registration'  
        />
    );
};

export default CompleteRegistration;