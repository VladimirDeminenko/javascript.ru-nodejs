// В какой момент срабатывают - до или после чтения файла?
const fs = require('fs');

fs.open(__filename, 'r', (err, fd) => {
  console.log('IO!');
});

setImmediate(() => {
  console.log('immediate');
});

process.nextTick(() => {
  console.log('nextTick');
});

new Promise(resolve => {
  resolve('promise');
}).then(console.log);

console.log('start!');
