const supertest = require('supertest');
const app = require('../src/app');

const req = supertest(app);

describe('Texte a resposta do servidor', () => {
  test('A aplicação deve responder na porta 3000', async () => {
    return req.get('/').then(res => {
      const status = res.status;

      expect(status).toEqual(200)
    }).catch( err => {
      fail(err)
    })
  });
});