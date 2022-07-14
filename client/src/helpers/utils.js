import omitDeep from "omit-deep";

export const removeKey = (object, removedKey) => {
    object = Object.keys(object).filter(key => key !== removedKey)
    .reduce((obj, key) =>
        {
            obj[key] = object[key];
            return obj;
        }, {}
    );
    return object;
};

export const getNewProfileObject = profileObject => {
    const images = profileObject.images.map(image => {
        return removeKey(image, '__typename');
    });
    let newProfile = {...profileObject};
    newProfile.images = [...images];
    newProfile = omitDeep(newProfile, ['__typename', '_id']);
    return newProfile;
};

export const getNewSinglePost = singlePostObject => {
    let newSinglePostObject = {...singlePostObject};
    newSinglePostObject.image = removeKey(singlePostObject.image, '__typename');  
    newSinglePostObject.postedBy = removeKey(singlePostObject.postedBy, '__typename');  
    newSinglePostObject = removeKey(newSinglePostObject, '__typename');
    return newSinglePostObject;
};