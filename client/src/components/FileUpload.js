import React, { useContext } from "react";
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import Image from "./Image";

const FileUpload = props => {
    const { state } = useContext(AuthContext);
    const { user } = state;

    const { 
        setUploadImageLoading, setValues, 
        values, uploadImageLoading, singleUpload
    } = props;
    const uploadOneImage = (file, oldImages) => {
        try {
            Resizer.imageFileResizer(
                file,
              300,
              300,
              "JPEG",
              100,
              0,
              async(uri) => {
                try {      
                    setUploadImageLoading(true);                      
                    const data = await axios.post(
                        `${process.env.REACT_APP_RESET_ENDPOINT}uploadImages`,
                        {
                            image: uri
                        },
                        {
                            headers: {
                                Authorization: user ? `Bearer ${user.token}` : ''
                            }
                        }
                    );    
                    //console.log(data)                        
                    if (data && data.data && data.data.public_id && data.data.url) {
                        if (singleUpload && singleUpload === true) {
                            setValues({
                                ...values,
                                image: data.data
                            })
                        } else {
                            oldImages.push(data.data);
                            setValues({
                                ...values,
                                images: [...oldImages]
                            })
                        }                                
                    } else if (data && data.data && data.data.message) {
                        toast.error(data.data.message);
                    }
                    setUploadImageLoading(false);  
                } catch (error) {
                    console.log(error.message);
                    toast.error(error.message);
                    setUploadImageLoading(false);  
                }
              },
              "base64",
              200,
              200
            );
          } catch (err) {
            console.log(err);
            toast.error(err.message);
            setUploadImageLoading(false);  
          }
    };

    const fileResizeAndUpload = (e) => {
        const oldImages = singleUpload && singleUpload === true ? [] : [...values.images];
        if (singleUpload && singleUpload === true) {
            const file = e.target.files[0];
            uploadOneImage(file, oldImages);
        } else if (e.target.files.length > 0) {            
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                uploadOneImage(file, oldImages);
            }     
        }
    };

    const handleImageRemove = async(publicId) => {
        try {
            setUploadImageLoading(true);
            const data = await axios.post(
                `${process.env.REACT_APP_RESET_ENDPOINT}removeImage`,
                {
                    public_id: publicId
                },
                {
                    headers: {
                        Authorization: user ? `Bearer ${user.token}` : ''
                    }
                }
            );
            setUploadImageLoading(false);
            if (data && data.data && data.data.success && data.data.success === true) {
                if (singleUpload && singleUpload === true) {
                    setValues({
                        ...values,
                        image: null
                    });
                } else {
                    setValues({
                        ...values,
                        images: [...values.images].filter(image => image.public_id !== publicId)
                    })
                }                
            } else if (data && data.data && data.data.message) {
                toast.error(data.data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
            setUploadImageLoading(false);
        }
    };

    const {images} = values;

    return (
        <div className="row mt-2">
            <div className="col-md-3">
                {
                    <div className="form-group">
                        <label 
                        className="btn btn-info btn-rounded mt-2 mb-2"
                        style={{
                            cursor: uploadImageLoading ? 'default' : 'pointer'
                        }}
                        >
                            {uploadImageLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : `Upload Image${singleUpload && singleUpload === true ? '' : 's'}`}
                            <input 
                            disabled={uploadImageLoading}
                            hidden
                            type='file'
                            accept="image/*"
                            multiple={singleUpload && singleUpload === true ? false : true}
                            onChange={fileResizeAndUpload}
                            className='form-control'
                            placeholder="Image"
                        />
                        </label>
                        
                    </div>
                }
            </div>
            <div className="col-md-9 text-end">
                {
                    values.image &&
                     <Image 
                        key={values.image.public_id}
                        {...values.image} 
                        handleImageRemove={handleImageRemove}
                        />
                }
                {
                    values.images &&
                    images.map(image => (
                        <Image 
                        key={image.public_id}
                        {...image} 
                        handleImageRemove={handleImageRemove}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default FileUpload;