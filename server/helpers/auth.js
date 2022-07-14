var admin = require("firebase-admin");
var serviceAccount = require('../config/fbServiceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


exports.authCheck = async(req) => {
    try {
        // console.log(req.headers);
        if (!req.headers.authorization) throw new Error('please enter your token!');
        let token = req.headers.authorization;
        token = token.slice(7, token.length); // Bearer xxxx
        const currentUser = await admin.auth().verifyIdToken(token);
        // console.log('currentUser : ', currentUser);
        return currentUser;
    } catch (error) {
        const newError = new Error(error.message);
        newError.code = 401;
        throw newError;
    }
};

exports.authCheckMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization;
        token = token.slice(7, token.length);
        admin.auth().verifyIdToken(token).then(result => {
            next();
        }).catch(err => {
            console.log(err);
            res.json({ error: 'Unauthorized'});
        });
    } else {
        res.json({ error: 'Unauthorized'});
    }
};