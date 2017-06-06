/**
 * app.js
 * Created by Vladimir Deminenko on 05.06.2017
 */

(function() {
    'use strict';

    const bunyan = require('bunyan');
    const log = bunyan.createLogger({name: 'myapp'});
    const server = require('./server');

    console.log('server starts on port 3000');
    log.info('hi');
    log.warn({lang: 'fr'}, 'au revoir');
})();
