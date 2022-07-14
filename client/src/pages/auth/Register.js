import React, { useState, useRef } from "react";
import { auth, sendSignInLinkToEmail2 } from '../../firebase';
import { toast } from 'react-toastify';
import AuthForm from "../../components/forms/AuthForm";


const Register = props => {
    const [loading, setLoading] = useState(false);
    const email = useRef();

    const submitHandler = async(e) => {
        e.preventDefault();
        const emailValue = email.current.value;
        try {
            setLoading(true);
            const config = {
                url: `${process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT}?email=${emailValue}`,
                handleCodeInApp: true
            };
            await sendSignInLinkToEmail2(auth, emailValue, config);
            // console.log("result : ", result);
            toast.success(`Email s Sent To ${emailValue}. Click The Link To Complete Your Registration.`);
            email.current.value = '';
            setLoading(false);
        } catch (error) {
            console.log("Register error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthForm
        formTitle='Register' 
        submitHandler={submitHandler} 
        email={email}
        loading={loading} 
        buttonTitle='Register'  
        />
    );
};

export default Register;