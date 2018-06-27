const {User} = require('../../DB/models/users');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');

    User.findByToken(token).then((user) => {
    if(!user) {
        return res.status(401).send();
    }
    req.user = user;
    req.token = token;
    next();  
    }).catch(e => res.status(401).send());
};

module.exports = {authenticate};