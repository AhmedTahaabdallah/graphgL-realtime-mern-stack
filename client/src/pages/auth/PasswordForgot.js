import React, { useState, useRef } from "react";
import { auth, sendPasswordResetEmail2 } from "../../firebase";
import { toast } from 'react-toastify';
import AuthForm from "../../components/forms/AuthForm";

const PasswordForgot = props => {
    const email = useRef();
    const [loading, setLoading] = useState(false);

    const submitHandler = async(e) => {
        e.preventDefault();
        const emailValue = email.current.value;
        if (!emailValue) {
            toast.error('Email is required.');
            return;
        }
        try {            
            setLoading(true);
            console.log(emailValue);
            const config = {
                url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
                handleCodeInApp: true
            };
            await sendPasswordResetEmail2(auth, emailValue, config);
            toast.success(`Email is sent to ${emailValue}, Click on the link to reset your password.`);         
            setLoading(false);
        } catch (error) {
            console.log("PasswordForgot error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthForm
        formTitle='Password Forgot' 
        submitHandler={submitHandler} 
        email={email}
        loading={loading} 
        buttonTitle='Reset Password'  
        />
    );
};

export default PasswordForgot;