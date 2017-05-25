/**
 * trace.js
 * Created by Vladimir Deminenko on 25.05.2017
 */

(function() {
    'use strict';

    Error.stackTraceLimit = 1000;
    require('trace');
    require('clarify');
})();
