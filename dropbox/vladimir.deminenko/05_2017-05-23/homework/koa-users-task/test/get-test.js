/**
 * app-test.js
 * Created by Vladimir Deminenko on 24.05.2017
 */

let config = require('config');

if (config.get('trace')) require(`../${config.get('libsPath')}/trace`);

let assert = require('assert');
let rp = require('request-promise');
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
        await User.create(getUsers())
            .then(users => {
                existingUsers = users;
            });
    });

    afterEach(() => {
    });

    describe('read users from database', async () => {
        it('should return all users', async () => {
            let options = {
                uri: `${URI}/users`
            };

            await rp(options)
                .then((body) => {
                    let users = Array.from(JSON.parse(body));
                    assert.equal(users.length, existingUsers.length, "lengths are not equal");

                    users.forEach((user, idx) => {
                        let existingUser = existingUsers[idx];
                        assert.equal(user._id, existingUser._id, "_ids are not equal");
                        assert.equal(user.email, existingUser.email, "emails are not equal");
                        assert.equal(user.displayName, existingUser.displayName, "displayNames are not equal");
                        assert.equal(new Date(user.createdAt).toString(), existingUser.createdAt.toString(), "created times are not equal");
                    });
                });
        });
    });
});

function getUsers() {
    const userCount = 4;
    let result = [];

    for (let i = 0; i < userCount;) {
        ++i;

        let user = new User({
            email: `user${i}@g${i}.com`,
            displayName: `User ${i}`
        });

        result.push(user);
    }

    return result;
}
