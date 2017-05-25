/**
 * app-test.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

require('../models/users');
let assert = require('assert');
let config = require('config');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let dbUsers = [];

mongoose.set('debug', config.get('debug'));

function getUsers() {
    let result = [];

    [1, 2, 3, 4].forEach(num => {
        let user = new User({
            email: `user${num}@g${num}.com`,
            displayName: `user${num}`
        });

        result.push(user);
    });

    return result;
}

describe('User REST API: POST', () => {
    before(() => {
        mongoose.connect(config.get('connection'), config.get('server'));
    });

    after(() => {
        mongoose.disconnect();
    });

    beforeEach(async () => {
        await User.remove({});
        await User.create(getUsers(), (err, usersArray) => {
            dbUsers = usersArray;
        });
    });

    afterEach(() => {
    });

    describe('read users from database', () => {
        it('should return all users', () => {
            assert.equal(dbUsers.length, 4);
        });
    });
});
