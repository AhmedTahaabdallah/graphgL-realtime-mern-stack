import React, { useState, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { PROFILE } from "../../gql/queries";
import { UPDATE_PROFILE } from "../../gql/mutations";
import ProfileForm from "../../components/forms/ProfileForm";
import { getNewProfileObject } from "../../helpers/utils";
import { AuthContext } from "../../context/authContext";
import LoadingToRedirect from "../../components/LoadingToRedirect";

const Profile = props => {

    const [updateProfile, {  
        loading: updateProfileLoading, 
        reset: updateProfileReset
    }] = useMutation(UPDATE_PROFILE);

    const [values, setValues] = useState({
        userName: '',
        name: '',
        email: '',
        about: '',
        images: [],
    });
    const [uploadImageLoading, setUploadImageLoading] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(false);

    const { data, loading, error } = useQuery(PROFILE);
    const { state } = useContext(AuthContext);
    const { user } = state;

    useMemo(() => {
        if (data && !isFirstTime && user) {
            setIsFirstTime(true);
            const { profile } = data;
            const newProfile = getNewProfileObject(profile);
            setValues({
                ...values,
                ...newProfile,
            });
        }
    }, [data, values, isFirstTime, user]);

    if (!user) return <LoadingToRedirect path='/login'/>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const handleSubmit = async(e) => {
        e.preventDefault();
        await updateProfile({
            variables: { input: values },
            onError: (err) => {
                const errorMessage = err.networkError &&  err.networkError.result && err.networkError.result.errors ?
                err.networkError.result.errors[0].message : null;
                toast.error(errorMessage || err.message);
                updateProfileReset();
            },
            onCompleted: (data) => {
                const { userUpdate } = data;
                const newProfile = getNewProfileObject(userUpdate);
                setValues({
                    ...values,
                    ...newProfile,
                });
                toast.success('Profile Update.');
                updateProfileReset();
            }
        });
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };
    
    return <div className="container p-5">        
        <ProfileForm 
        {...values}
        loading={loading}
        updateProfileLoading={updateProfileLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setUploadImageLoading={setUploadImageLoading}
        setValues={setValues}
        values={values} 
        uploadImageLoading={uploadImageLoading}
        />
    </div>
};

export default Profile;