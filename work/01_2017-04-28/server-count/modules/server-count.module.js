/**
 * server.count.module.js
 * Created by Vladimir Deminenko on 28.04.2017
 */

let sender = {};

sender.sendResponse = (res, value) => {
    console.log('sender.sendResponse(res, %s)', value);
    res.end(value.toString());
};

module.exports = sender;
