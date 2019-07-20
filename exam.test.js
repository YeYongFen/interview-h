const fetch = require('./exam-intermediate');

const obj = {
  action: 'single',
  accessKeyID: '111',
  accessKeySecret: '222',
  accountName: '3333',
  toAddress: '777',
};

const obj2 = {
  action: 'single',
  accessKeyID: '111',
  accessKeySecret: '222',
  accountName: '3333',
  toAddress: '777',
  tagName: 'div',
};

describe('test request', () => {
  it('it should be success when config.action == single', () => {
    const p = fetch(obj);
    p.then((d) => {
      expect(!!d).toBe(true);
    }).catch(e => {
      expect(false).toBe(true);
    });
  });

  it('it should be success when config.action == batch', () => {
    const p = fetch(obj2);
    p.then((d) => {
      expect(!!d).toBe(true);
    }).catch(e => {
      expect(false).toBe(true);
    });
  });
});
