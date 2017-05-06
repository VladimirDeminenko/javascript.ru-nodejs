// unit, integration, e2e

const config = require('config');
const assert = require('assert');
const server = require(`${config.serverPath}/app`).server;
const dirName = require(`${config.serverPath}/app`).getDirName();
const request = require('request');
const fs = require('fs');

describe('server tests', () => {
    let app;

    before(done => {
        app = server.listen(3000, done);
    });

    after(done => {
        app.close(done);
    });

    // describe('GET tests', () => {
    //     it('check body', done => {
    //         request('http://localhost:3000', function(error, res) {
    //             if (error) return done(error);
    //
    //             assert.equal(res.body, 'GET file ""; status: 400 Bad Request');
    //
    //             done();
    //         });
    //     });
    //
    //     it('check statusCode', done => {
    //         request('http://localhost:3000', function(error, res) {
    //             if (error) return done(error);
    //             assert.equal(res.statusCode, 400);
    //
    //             done();
    //         });
    //     });
    // });

    describe('read files by GET request', () => {
        const FILE_NAMES = [
            'empty',
            'file001.md',
            'file001.pdf',
            'good-nigth.jpg'
        ];

        FILE_NAMES.forEach(fileName => {
            it(`should return "files/${fileName}" file by request "${config.host}:${config.port}/${fileName}"`, done => {
                request(`${config.host}:${config.port}/${fileName}`, function(error, response, body) {
                    if (error) return done(error);

                    const file = fs.readFileSync(`${config.filesRoot}/${fileName}`);
                    assert.equal(body, file, `body !== ${fileName}`);

                    done();
                });
            });
        });

        let fileName = 'index.html';
        describe(`read "public/${fileName}" file --> ${dirName}`, () => {

            it(`should return "public/${fileName}" by request "${config.host}:${config.port}/"`, done => {
                request(`${config.host}:${config.port}/`, function(error, response, body) {
                    if (error) return done(error);

                    const file = fs.readFileSync(`${config.publicRoot}/${fileName}`, {encoding: 'utf-8'});
                    assert.equal(body, file, `body !== ${fileName}`);

                    done();
                });
            });

            it(`should return "public/${fileName}" by request "${config.host}:${config.port}/${fileName}"`, done => {
                request(`${config.host}:${config.port}/${fileName}`, function(error, response, body) {
                    if (error) return done(error);

                    const file = fs.readFileSync(`${config.publicRoot}/${fileName}`, {encoding: 'utf-8'});
                    assert.equal(body, file, `body !== ${fileName}`);

                    done();
                });
            });
        });
    });
});
