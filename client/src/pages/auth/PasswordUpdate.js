import React, { useRef, useState } from "react";
import { auth, updatePassword2 } from "../../firebase";
import { toast } from 'react-toastify';
import AuthForm from "../../components/forms/AuthForm";

const PasswordUpdate = props => {
    const password = useRef();
    const [loading, setLoading] = useState(false);

    const submitHandler = async(e) => {
        e.preventDefault();
        const passwordValue = password.current.value;
        if (!passwordValue) {
            toast.error('password is required.');
            return;
        }
        try {            
            setLoading(true);
            const user = auth.currentUser;
            await updatePassword2(user, passwordValue);
            toast.success(`Password Updated.`);         
            setLoading(false);
        } catch (error) {
            console.log("PasswordUpdate error : ", error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthForm
        formTitle='Password Update' 
        submitHandler={submitHandler} 
        password={password}
        loading={loading} 
        buttonTitle='Update Password'  
        />
    );
};

export default PasswordUpdate;