/**
 * postUsers.js
 * Created by Vladimir Deminenko on 26.05.2017
 */

(function() {
    'use strict';

    let config = require('config');
    const BASE_URI = config.get('baseUri');

    if (config.get('trace')) require(`../${config.get('libPath')}/trace`);

    let assert = require('assert');
    let reqPromise = require('request-promise').defaults({
        resolveWithFullResponse: true,
        simple: false
    });

    let userUtils = require('./lib/userUtils');

    let mongoose = require('mongoose');
    require('../models/users');
    let User = mongoose.model('User');
    mongoose.set('debug', config.get('debug'));

    describe('User REST API: POST', () => {
        let existingUsers = [];

        before(() => {
            mongoose.connect(config.get('connection'), config.get('server'));
        });

        after(() => {
            mongoose.disconnect();
        });

        beforeEach(async () => {
            await User.remove({});
            await User.create(userUtils.getUsers())
                .then(users => {
                    existingUsers = users;
                });
        });

        it("should add new user", async function() {
            let options = {
                uri: `${BASE_URI}/users/`,
                body: {
                    email: 'newuser@domain.com',
                    displayName: 'New User'
                },
                json: true
            };

            let response = await reqPromise.post(options);
            let newUser = response.body;
            let existingUsersArray = await User.find({email: `${options.body.email}`});

            assert.equal(response.statusCode, 200, "status codes are not equal");
            assert.equal(existingUsersArray.length, 1, "wrong new user count");
            userUtils.compareUsers(newUser, existingUsersArray[0]);
        });

        it("should not add existing user", async function() {
            let options = {
                uri: `${BASE_URI}/users/`,
                body: {
                    email: 'newuser@domain.com',
                    displayName: 'New User'
                },
                json: true
            };

            await reqPromise.post(options);
            let response = await reqPromise.post(options);
            let errorObj = response.body;

            assert.equal(response.statusCode, 400, "status codes are not equal");
            assert.equal(errorObj.errors.email.indexOf('E11000'), 0, "error message is wrong");
        });
    });
})();
