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
let dbUsers = [];

const URI = config.get('uri');

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

describe('User REST API: GET', () => {
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

    describe('read users from database', async () => {
        it('should return all users', async () => {
            let options = {
                uri: `${URI}/users`
            };

            await rp(options)
                .then((body) => {
                    let users = Array.from(JSON.parse(body));

                    users.forEach((user, idx) => {
                        let dbUser = dbUsers[idx];

                        assert.equal(user._id, dbUser._id, "_ids are not equal");
                        assert.equal(user.email, dbUser.email, "emails are not equal");
                        assert.equal(user.displayName, dbUser.displayName, "displayNames are not equal");
                        assert.equal(new Date(user.createdAt).toString(), dbUser.createdAt.toString(), "created times are not equal");
                    });
                });
        });
    });
});
