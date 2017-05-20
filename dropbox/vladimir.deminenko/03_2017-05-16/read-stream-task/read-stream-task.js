/**
 * read-stream-task.js
 * Created by Vladimir Deminenko on 17.05.2017
 */
const fs = require('fs');

// хотим читать данные из потока в цикле

function readStream(stream) {
    let missedErrors = [];

    stream.on('error', onMissedError);

    function onMissedError(err) {
        missedErrors.push(err);
    }

    return function() {
        return new Promise((resolve, reject) => {
                let error = missedErrors.shift();

                if (error) {
                    stream.removeListener('error', onMissedError);
                    return reject(error);
                }

                stream.on('data', ondata);
                stream.on('error', onerror);
                stream.on('end', onend);
                stream.resume();

                function ondata(chunk) {
                    stream.pause(); // until new promise is created, stream doesn't generate new data
                    cleanup();
                    resolve(chunk);
                }

                function onend() {
                    cleanup();
                    resolve(null);
                }

                function onerror(err) {
                    stream.removeListener('error', onMissedError);
                    cleanup();
                    reject(err);
                }

                function cleanup() {
                    stream.removeListener('data', ondata);
                    stream.removeListener('error', onerror);
                    stream.removeListener('end', onend);
                }
            }
        );
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
