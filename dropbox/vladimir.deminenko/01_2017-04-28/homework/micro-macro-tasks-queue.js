// какой порядок вывода в console ?

// microqueues = [];
// macroqueues = [];

const intervalId = setInterval(() => {
  console.log('setInterval');
}, 0);

setTimeout(() => {
  console.log('setTimeout 1');

  const promise = new Promise((resolve, reject) => {
    resolve('then 4');
  });

  promise
    .then((value) => {
      console.log(value);

      setTimeout(() => {
        console.log('setTimeout 2');
        clearInterval(intervalId);
      }, 0);
    });
}, 0);

const promise = new Promise((resolve, reject) => {
  resolve('then 1');
});

promise
  .then((value) => {
    console.log(value);
    return 'then 2';
  })
  .then((value) => {
    console.log(value);

    return new Promise((resolve, reject) => {
      setTimeout(resolve, 0, 'then 3');
    });
  })
  .then((value) => {
    console.log(value);
  });


// мой ответ
// 1. then 1
// 2. then 2
// 3. then 3
// 4. setInterval
// 5. setTimeout 1
// 6. then 4
// 7. setInterval
// 8. setTimeout 2

// правильный ответ
// then 1
// then 2
// setInterval
// setTimeout 1
// then 4
// then 3
// setInterval
// setTimeout 2


