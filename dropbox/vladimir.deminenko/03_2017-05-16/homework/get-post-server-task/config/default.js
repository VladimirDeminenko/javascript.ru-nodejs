/**
 * default.js
 * Created by Vladimir Deminenko on 06.05.2017
 */

const BASE_ROOT = `${process.cwd()}/dropbox/vladimir.deminenko/01_2017-04-28/homework/get-post-server-task`;
const BASE_ROOT_4_TESTS = `${process.cwd()}/dropbox/vladimir.deminenko/03_2017-05-16/homework/get-post-server-task`;

let port = 3000;
let projectRoot = BASE_ROOT;
let filesRoot = `${projectRoot}/files`;
let dataRoot = `${filesRoot}/files`;

if (process.env.START_CASE == "TEST") {
    projectRoot = BASE_ROOT_4_TESTS;
    filesRoot = `${BASE_ROOT_4_TESTS}/test/files`;
    dataRoot = `${BASE_ROOT_4_TESTS}/test/data`;
    port = 3001;
}

module.exports = {
    dataRoot: dataRoot,
    fileSizeLimit: 1e6,
    filesRoot: filesRoot,
    host: 'http://localhost',
    indexFile: 'index.html',
    port: port,
    projectRoot: projectRoot,
    publicRoot: `${projectRoot}/public`,
    serverPath: `${projectRoot}/dist/server`,
    testRoot: `${projectRoot}/test`
};

