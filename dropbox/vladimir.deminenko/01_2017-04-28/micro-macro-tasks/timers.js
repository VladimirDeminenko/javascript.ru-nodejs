// В какой момент срабатывают - до или после чтения файла?
const fs = require('fs');

/*
 macrotasks: [immediate, fs.open]
 microtasks: [nextTick, nextTick, nextTick, promise]
 */
//
// a(() => console.log('done'));
//
// 1 + 2;

const asyncFx = (parameter, cb) => {
    if (parameter < 10) {
        process.nextTick(() => cb(new Error('parameter should be greater than 10')));
    }

    setTimeout(cb, 1000);
};

fs.open(__filename, 'r', (err, fd) => {
        console.log('8.IO!');
    }
);

setImmediate(() => {
    console.log('7.immediate');
});

new Promise(
    resolve => {
        resolve('6.promise');
    })
    .then(console.log);

process.nextTick(() => {
    console.log('2.nextTick');

    process.nextTick(() => {
        console.log('5.nextTick');
    });
});

let value1 = 15;

asyncFx(value1, () => {
    console.log('9.1.asyncFx(%s)', value1);
});

new Promise((resolve, reject) => {
    asyncFx(value1, (error) => {
        if (error) {
            return reject(new Error(error.message));
        }

        return resolve(value1);
    });
})
    .then(() => {
            console.log('9.2. new Promise.resolve(asyncFx(%s))', value1);
        }
    )
    .catch(error => {
        console.log('9.3. new Promise.resolve(asyncFx(%s)) ERROR: %s', value1, error.message);
    });


let value2 = 2;

new Promise((resolve, reject) => {
    asyncFx(value2, (error) => {
        if (error) {
            return reject(new Error(error.message));
        }

        return resolve(value2);
    });
})
    .then(() => {
            console.log('10.2. new Promise.resolve(asyncFx(%s))', value2);
        }
    )
    .catch(error => {
        console.log('10.3. new Promise.resolve(asyncFx(%s)) ERROR: %s', value2, error.message);
    });


asyncFx(value2, () => {
    console.log('10.1.asyncFx(%s)', value2);
});

process.nextTick(() => {
    console.log('3.nextTick');
});

process.nextTick(() => {
    console.log('4.nextTick');
});

console.log('1.start!');
