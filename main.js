// const f = require('./exam-intermediate');

// f({
//   action: 'single',
//   accessKeyID: '111',
//   accessKeySecret: '222',
//   accountName: '3333',
//   toAddress: '777',
// }, (e) => {
//   console.log(e);
// });

const obj = {
  action: 'single',
  accessKeyID: '111',
  accessKeySecret: '222',
  accountName: '3333',
  toAddress: '777',
};

const f = require('./exam-intermediate');

const p = f(obj);

p.then((d) => {
  console.log(d);
}).catch(e => {
  console.log(e);
});
