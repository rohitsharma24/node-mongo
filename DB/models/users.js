const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }

    }]
});

UserSchema.methods.toJSON = function() {
    const user = this;
    return _.pick(user.toObject(), ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token})
    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access
    }).then(user => Promise.resolve(user));
};

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            Promise.reject();
        }
        return bcrypt.compare(password, user.password).then((response) => {
            if(response) {
                return Promise.resolve(user);
            } else {
                return Promise.reject();
            }
        });
    }).catch(() => Promise.reject());
};

UserSchema.pre('save', function(next) {
    const user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                next();
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    next();
                } else {
                    user.password = hash;
                    next();
                }
            })
        });
    } else {
        next();
    }
});

var User = mongoose.model('user', UserSchema);

module.exports = {User};