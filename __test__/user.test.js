const supertest = require('supertest');
const app = require('../src/app');

const request = supertest(app);

const mainUser = {
  name: 'Ricardo Junior',
  email: 'ricardo@teste.com',
  password: '123456'
}

beforeAll(() => {
  return request.post('/user')
    .send(mainUser)
    .then(res => {})
    .catch(err => console.log(err));
});

afterAll(() => {
  return request.delete(`/user/${mainUser.email}`)
    .then(() => {})
    .catch(err => console.log(err));
});

describe('Create users', () => {
  it('Deve criar um novo usuário', () => {
    const time = Date.now();
    const user = {
      name: 'Ricardo',
      email: `${time}@test.com`,
      password: '123456'
    }

    return request.post('/user').send(user).then(res => {
      expect(res.status).toEqual(200);
      expect(res.body.email).toEqual(user.email);
    }).catch(err => {
      fail(err)
    });
  });

 it('Deve impedir que um usuário seja criado com os dados vazios', () => {
  const user = {
    name: '',
    email: '',
    password: ''
  }

  return request.post('/user').send(user).then(res => {
    expect(res.status).toEqual(400);
  }).catch(err => {
    fail(err)
  });
 });

 it('Deve impedir que um usuário seja criado com um email que ja existe', () => {
    const time = Date.now();
    const user = {
      name: 'Ricardo',
      email: `${time}@test.com`,
      password: '123456'
    }

    return request.post('/user').send(user).then(res => {
      expect(res.body.email).toEqual(user.email);

      return request.post('/user').send(user).then(res => {
        expect(res.status).toEqual(400);
      }).catch(err => {
        fail(err)
      })
    }).catch(err => {
      fail(err)
    });
  })
});

describe('Aitentição', () => {
  it('Deve me retornar um token ao criar sessão', () => {
    return request.post('/auth')
      .send({ email: mainUser.email, password: mainUser.password})
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.token).toBeDefined()
      })
      .catch(err => fail(err));
  });

  it('Deve impedir que um usuário não cadastrado faça login', () => {
    return request.post('/auth')
      .send({ email: 'testeerro@teste.com', password: '101010'})
      .then(res => {
        expect(res.status).toEqual(400);
        expect(res.body.msg).toEqual('Usuario nao existe');
      })
      .catch(err => fail(err));
  });

  it('Deve impedir que um usuário não faça login com a senha errada', () => {
    return request.post('/auth')
      .send({ email: mainUser.email, password: '101010'})
      .then(res => {
        expect(res.status).toEqual(400);
        expect(res.body.msg).toEqual('Senha incorreta');
      })
      .catch(err => fail(err));
  });
});