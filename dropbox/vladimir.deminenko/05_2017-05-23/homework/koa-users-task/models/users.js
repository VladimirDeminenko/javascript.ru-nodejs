/**
 * users.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

(function() {
    'use strict';

    require('mongoose-type-email');
    require('mongoose-beautiful-unique-validation');
    let mongoose = require('mongoose');
    let userSchema = new mongoose.Schema(
        {
            email: {
                type: mongoose.SchemaTypes.Email,
                unique: true,
                required: 'Такой email уже есть'
            },
            displayName: {
                type: String,
                trim: true,
                unique: true,
                required: 'Такое имя уже есть'
            }
        },
        {
            timestamps: true
        });

    mongoose.Promise = Promise;

    mongoose.model('User', userSchema);
})();
