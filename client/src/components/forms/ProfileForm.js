import React from "react";
import FileUpload from "../FileUpload";

const ProfileForm = props => {
    const { 
        userName, name, email, handleChange,
        handleSubmit, loading, about,
        setUploadImageLoading, setValues, 
        values, uploadImageLoading,
        updateProfileLoading
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>User Name:</label>
                <input 
                    type='text'
                    name="userName"
                    value={userName}
                    onChange={handleChange}
                    className='form-control'
                    placeholder="User Name"
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Name:</label>
                <input 
                    type='text'
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className='form-control'
                    placeholder="Name"
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Email :</label>
                <input 
                    type='email'
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className='form-control'
                    placeholder="Email"
                    disabled={loading}
                />
            </div>
            <FileUpload
            setUploadImageLoading={setUploadImageLoading}
            setValues={setValues}
            values={values} 
            uploadImageLoading={uploadImageLoading}
            />            
            <div className="form-group">
                <label>About :</label>
                <textarea
                    name="about"
                    value={about || ''}
                    onChange={handleChange}
                    className='form-control'
                    placeholder="About"
                    disabled={loading}
                />
            </div>
            <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={updateProfileLoading || uploadImageLoading}
            >{updateProfileLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            : 'Submit'}</button>
        </form>
    );
};

export default ProfileForm;