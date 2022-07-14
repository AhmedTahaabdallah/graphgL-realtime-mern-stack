import React from "react";

const Image = props => {
    const { 
        public_id, url, handleImageRemove, 
    } = props;
    return (
        <div
            key={public_id}
            style={{
                display: 'inline-block',
                position: 'relative'
            }}      
            className='img-thumbnail m-2'
            >
                <img 
                    src={url}
                    key={public_id}
                    alt={public_id}
                    style={{ height: '100px', maxWidth: '-webkit-fill-available' }}                                    
                />
                {
                    handleImageRemove && <i 
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '5px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleImageRemove(public_id)}
                    className="fas fa-times-circle fa-lg"></i>}

            </div>
    );
};

export default Image;