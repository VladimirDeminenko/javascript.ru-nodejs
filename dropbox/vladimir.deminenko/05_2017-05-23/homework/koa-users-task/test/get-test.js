/**
 * get-test.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

let config = require('config');

if (config.get('trace')) require(`../${config.get('libsPath')}/trace`);

let assert = require('assert');
let reqPromise = require('request-promise').defaults({
    resolveWithFullResponse: true,
    simple: false
});

let userUtils = require('./utils/user-utils');

let mongoose = require('mongoose');
require('../models/users');
let User = mongoose.model('User');

const URI = config.get('uri');

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

    describe('read users from database', async () => {
        it("user does not exist", async function() {
            let options = {
                uri: `${URI}/users/5927497bf72cb7d7984caa1e`,
                json: true
            };

            let response = await reqPromise.get(options);
            assert.equal(response.statusCode, 404, "status codes are not equal");
        });

        it('should return all users', async () => {
            let options = {
                uri: `${URI}/users`,
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
                uri: `${URI}/users/${existingUser._id}`,
                json: true
            };

            await reqPromise(options)
                .then((response) => {
                    let user = response.body;
                    assert.equal(response.statusCode, 200, "status codes are not equal");
                    userUtils.compareUsers(user, existingUser);
                });
        });
    });
});
