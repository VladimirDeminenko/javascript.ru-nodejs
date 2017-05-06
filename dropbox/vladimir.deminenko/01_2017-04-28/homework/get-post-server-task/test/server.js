// unit, integration, e2e

const assert = require('assert');
const server = require('../dist/server/app').server;
const dirName = require('../dist/server/app').getDirName();
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


    it('should return index.html', done => {
        /*
         1. запустить сервер (before)
         2. сделать запрос
         3. прочесть файл с диска
         4. дождаться ответа от сервера
         5. сравнить файл с диска с тем, что пришел с сервера
         */

        request('http://localhost:3000/file001.md', function(error, response, body) {
            if (error) return done(error);

            // const file = fs.readFileSync(`${__dirname}/../public/index.html`, { encoding: 'utf-8' });
            const file = fs.readFileSync(`${__dirname}/../files/file001.md`, { encoding: 'utf-8' });
            assert.equal(body, file, `body !== file001.md`);
            // assert.equal(body, file, `body !== index.html`);

            done();
        });
    });
});
