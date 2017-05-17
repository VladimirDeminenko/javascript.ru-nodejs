// ЗАДАЧА - сделать readFile, возвращающее promise
// ЗАДАЧА - прочитать все файлы текущей директории, используя новый readfile
// (последовательно или параллельно - как считаете нужным)

const fs = require('fs');
const START_DIR = './';

readFilesFrom(START_DIR);

function readFile(filePath) {
    /* ваш код */
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, file) => {
            console.log('\n%s:', filePath);

            if (err) return reject(err);

            return resolve(file);
        });
    });
}

function readFilesFrom(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error(err);
        }

        files
            .forEach(fileName => {
                const FULL_PATH = `${dir}${fileName}`;

                fs.stat(FULL_PATH, (err, stats) => {
                    if (err) {
                        return console.error(err);
                    }

                    if (stats.isFile()) {
                        readFile(FULL_PATH).then(console.log, console.error);
                    }
                });
            });
    });
}

