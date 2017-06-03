/**
 * users.js
 * Created by Vladimir Deminenko on 30.05.2017
 */

(function() {
    'use strict';

    require('mongoose-type-email');
    require('mongoose-beautiful-unique-validation');
    let mongoose = require('mongoose');
    let userSchema = new mongoose.Schema({
            email: {
                type: mongoose.SchemaTypes.Email,
                unique: true,
                required: true
            },
            displayName: {
                type: String,
                trim: true,
                unique: false,
                required: true
            },
            hash: String,
            salt: String
        },
        {
            timestamps: true
        }
    );

    userSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = getHash(password, this.salt);
    };

    userSchema.methods.validPassword = function(password) {
        return this.hash === getHash(password, this.salt);
    };

    userSchema.methods.generateJwt = function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                displayName: this.displayName,
                exp: parseInt(expiry.getTime() / 1000)
            },
            process.env.JWT_SECRET
        );
    };

    var getHash = function(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
    };

    mongoose.Promise = Promise;
    mongoose.model('User', userSchema);
})();
