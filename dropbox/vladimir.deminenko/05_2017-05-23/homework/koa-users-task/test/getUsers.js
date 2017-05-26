/**
 * getUsers.js
 * Created by Vladimir Deminenko on 24.05.2017
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

    describe('User REST API: GET', () => {
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

        it("user does not exist", async function() {
            let options = {
                uri: `${BASE_URI}/users/5927497bf72cb7d7984caa1e`,
                json: true
            };

            let response = await reqPromise.get(options);
            assert.equal(response.statusCode, 404, "status codes are not equal");
        });

        it('should return all users', async () => {
            let options = {
                uri: `${BASE_URI}/users`,
                json: true
            };

            await reqPromise(options)
                .then((response) => {
                    let body = response.body;
                    let users = Array.from(body);

                    assert.equal(response.statusCode, 200, "status codes are not equal");
                    assert.equal(users.length, existingUsers.length, "sizes are not equal");

                    users.forEach((user, idx) => {
                        let existingUser = existingUsers[idx];
                        userUtils.compareUsers(user, existingUser);
                    });
                });
        });

        it('should return user by id', async () => {
            let existingUser = userUtils.getRandomUserFrom(existingUsers);
            let options = {
                uri: `${BASE_URI}/users/${existingUser._id}`,
                json: true
            };

            await reqPromise(options)
                .then(response => {
                    let user = response.body;
                    userUtils.compareUsers(user, existingUser);
                });
        });
    });
})();
