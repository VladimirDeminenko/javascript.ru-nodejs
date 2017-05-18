/**
 * read-stream-task.js
 * Created by Vladimir Deminenko on 17.05.2017
 */
const fs = require('fs');

// хотим читать данные из потока в цикле

function readStream(stream) {

    return function() {
        stream.removeAllListeners();

        return new Promise((resolve, reject) => {
            stream.on('data', chunk => {
                return resolve(chunk);
            });

            stream.on('error', error => {
                reject(error);
            });
        });
    }
}

async function read(path) {

    let stream = fs.createReadStream(path, {highWaterMark: 60, encoding: 'utf-8'});

    let data;

    // ЗАДАЧА: написать такой readStream
    let reader = readStream(stream);
    let chunkNum = 0;

    while (data = await reader()) {
        console.log('\n-- chunk #%s(%s) --', ++chunkNum, data.length);
        console.log(data);
    }

    // stream finished
}

read(__filename).catch(console.error);
