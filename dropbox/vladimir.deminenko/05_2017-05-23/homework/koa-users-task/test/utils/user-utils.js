/**
 * user-utils.js
 * Created by Vladimir Deminenko on 26.05.2017
 */

(function() {
    'use strict';

    let assert = require('assert');
    let mongoose = require('mongoose');
    require('../../models/users');
    let User = mongoose.model('User');

    let compareUsers = (actualUser, expectedUser) => {
        assert.equal(actualUser._id, expectedUser._id, "_ids are not equal");
        assert.equal(actualUser.email, expectedUser.email, "emails are not equal");
        assert.equal(actualUser.displayName, expectedUser.displayName, "displayNames are not equal");
        assert.equal(new Date(actualUser.createdAt).toString(), expectedUser.createdAt.toString(), "created times are not equal");
    };

    let getRandomUserFrom = users => {
        return users[Math.floor(Math.random() * users.length)];
    };

    let getUsers = () => {
        const userCount = 4;
        let result = [];

        for (let num = 0; num < userCount;) {
            ++num;

            let user = new User({
                email: `user${num}@g${num}.com`,
                displayName: `User ${num}`
            });

            result.push(user);
        }

        return result;
    };

    module.exports = {
        compareUsers: compareUsers,
        getRandomUserFrom: getRandomUserFrom,
        getUsers: getUsers
    };
})();
