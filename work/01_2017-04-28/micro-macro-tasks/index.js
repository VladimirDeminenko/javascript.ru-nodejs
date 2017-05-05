/**
 * index.js
 * Created by Vladimir Deminenko on 29.04.2017
 */

console.log('1.script start');

setTimeout(() => {
    console.log('5.setTimeout');
}, 0);

Promise
    .resolve()
    .then(() => {
            console.log('3.promise');
        }
    )
    .then(() => {
            console.log('4.promise');
        }
    );

console.log('2.script end');
