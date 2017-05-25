// unit, integration, e2e

const config = require('config');
const assert = require('assert');
const server = require(`${config.serverPath}/app`).server;
const request = require('request').defaults({
    encoding: null
});

const rp = require('request-promise').defaults({
    encoding: null,
    resolveWithFullResponse: true
});

const fs = require('fs');
const FILES_ROOT = config.filesRoot;
const DATA_ROOT = config.dataRoot;
const PORT = config.port;


const FILE_NAMES = [
    'empty'
    // 'file001.md',
    // 'file001.pdf',
    // 'good-nigth.jpg'
];

let runTests = () => {
    describe('server tests', () => {
        let app;

        before(done => {
            console.log('- server tests before');
            app = server.listen(PORT, done);
        });

        after(done => {
            console.log('- server tests after');
            app.close(done);
        });

        testSuitGET(FILE_NAMES);
        // testSuitPOST(FILE_NAMES);
        // testSuitDELETE(FILE_NAMES);
    });
};

let testSuitGET = (files) => {
    before(done => {
        console.log('  - testSuitGET() before');
        removeFiles();
        copyFiles();

        done();
    });

    describe('read files by GET request', () => {
        files.forEach(file => {
            it(`check body: should return "files/${file}" file by request "${config.host}:${config.port}/${file}"`, async () => {
                // request(`${config.host}:${config.port}/${file}`, (err, response, body) => {
                //     if (err) return done(err);
                //
                //     const fileBody = fs.readFileSync(`${FILES_ROOT}/${file}`);
                //     assert.equal(body, fileBody, `body !== ${file}`);
                //     done();
                // });

                const fileBody = fs.readFileSync(`${FILES_ROOT}/${file}`);
                const response = await rp(`${config.host}:${config.port}/${file}`);
                assert.equal(response.body, fileBody, `body !== ${file}`);
            });
        });

        let file = 'index.html';
        describe(`check body: "public/${file}" file`, () => {
            it(`check body: should return "public/${file}" by request "${config.host}:${config.port}/"`, done => {
                request(`${config.host}:${config.port}/`, (err, response, body) => {
                    if (err) return done(err);

                    const path = fs.readFileSync(`${config.publicRoot}/${file}`, {encoding: 'utf-8'});
                    assert.equal(body, path, `body !== ${file}`);
                    done();
                });
            });

            it(`check body: should return "public/${file}" by request "${config.host}:${config.port}/${file}"`, done => {
                request(`${config.host}:${config.port}/${file}`, (err, response, body) => {
                    if (err) return done(err);

                    const path = fs.readFileSync(`${config.publicRoot}/${file}`, {encoding: 'utf-8'});
                    assert.equal(body, path, `body !== ${file}`);
                    done();
                });
            });
        });

        describe(`check status code: "public/${file}" file`, () => {
            files.slice(-1).forEach(file => {
                it(`check status code: ${file} exists`, done => {
                    request(`${config.host}:${config.port}/${file}`, (err, response) => {
                        if (err) return done(err);

                        assert.equal(response.statusCode, 200);
                        done();
                    });
                });

                it(`check status code: : ${file} not exists`, done => {
                    file = `not-exist-${file}`;

                    request(`${config.host}:${config.port}/${file}`, (err, response) => {
                        if (err) return done(err);

                        assert.equal(response.statusCode, 404);
                        done();
                    });
                });
            });
        });
    });
};

let testSuitPOST = (fileNames) => {
    before(done => {
        console.log('  - testSuitPOST() before');
        removeFiles(done);
    });

    describe('write files by POST request', () => {
        FILE_NAMES.forEach(file => {
            it(`a try to write a not exist file "files/${file}" by request "${config.host}:${config.port}/${file}"`, done => {
                request.post(`${config.host}:${config.port}/${file}`, (err, response) => {
                    if (err) return done(err);

                    console.log(`${config.host}:${config.port}/${file}`);

                    assert.equal(response.statusCode, 409);
                    console.log('', response.body);
                    done();
                });
            });

            // it(`a try to write an exist file "files/${file}" by request "${config.host}:${config.port}/${file}"`, done => {
            //     request.post(`${config.host}:${config.port}/${file}`, (err, response) => {
            //         if (err) return done(err);
            //
            //         assert.equal(response.statusCode, 409);
            //         done();
            //     });
            // });
        });
    });
};

let testSuitDELETE = (fileNames) => {
    before(done => {
        console.log('  - testSuitDELETE() before');
        removeFiles();
        copyFiles();
        done();
    });

    describe('delete files by DELETE request', () => {
        FILE_NAMES.forEach(file => {
            file = `not-exist-${file}`;

            it(`a try to delete a not exist file "files/${file}" by request "${config.host}:${config.port}/${file}"`, done => {
                request.del(`${config.host}:${config.port}/${file}`, (err, response) => {
                    if (err) return done(err);
                    assert.equal(response.statusCode, 404);

                    done();
                });
            });
        });

        FILE_NAMES.forEach(file => {
            it(`a try to delete an exist file "files/${file}" by request "${config.host}:${config.port}/${file}"`, done => {
                request.del(`${config.host}:${config.port}/${file}`, (err, response) => {
                    if (err) return done(err);
                    assert.equal(response.statusCode, 200);

                    done();
                });
            });
        });
    });
};

const removeFiles = (done) => {
    fs.readdir(`${FILES_ROOT}`, (err, files) => {
        if (err) {
            console.log('\n## removeFiles() read error:', err.message);

            if (done) done();

            return;
        }

        files.forEach(file => {
            fs.unlink(`${FILES_ROOT}/${file}`, err => {
                if (err) {
                    return console.log('\n## removeFiles() delete error:', err.message);
                }

                console.log('\t- removeFiles():', file);
            });
        });

        if (done) done();
    });
};

const copyFiles = () => {
    fs.readdir(`${DATA_ROOT}`, (err, files) => {
        if (err) {
            return console.log('\n## copyFiles() read error:', err.message);
        }

        files.forEach(file => {
            let rStream = fs.createReadStream(`${DATA_ROOT}/${file}`);
            let wStream = fs.createWriteStream(`${FILES_ROOT}/${file}`);
            rStream.pipe(wStream);
        });
    });
};

runTests();
