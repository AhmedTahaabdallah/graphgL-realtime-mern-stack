import React from "react";
import FileUpload from "../FileUpload";

const PostForm = props => {
    const { 
        handleChange, handleSubmit, newPostLoading,
        setUploadImageLoading, setValues, 
        values, uploadImageLoading,
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <h4>{`${values._id ? 'Post Update' : 'Creat Post'}`}</h4>
            <div className="form-group">
                <textarea
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    className='form-control md-textarea'
                    placeholder="Write Something Cool"
                    disabled={newPostLoading}
                    rows='10'
                    maxLength='150'
                />
            </div>
            <FileUpload
            setUploadImageLoading={setUploadImageLoading}
            setValues={setValues}
            values={values} 
            uploadImageLoading={uploadImageLoading}
            singleUpload={true}
            />            
            
            <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={uploadImageLoading}
            >{newPostLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            : values._id ? 'Update' : 'Post'}</button>
        </form>
    );
};

export default PostForm;