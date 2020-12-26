import auth from './auth';
import { SUCCESS_STATUS } from '@mokuroku/mokuroku-commons/dictionaries/statuses';
import { setup as middlewareSetup } from '../middleware/setup';

const localStorage = require('localStorage');
describe('Auth', () => {
  const mockSuccessResponse = { status: SUCCESS_STATUS, result: { token: '123' } };
  const mockJsonPromise = Promise.resolve(mockSuccessResponse);
  const mockFetchPromise = Promise.resolve({
    json: () => mockJsonPromise,
  });
  global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
  /*it('Logs in a user when info is provided', (done) => {
    auth.login({ username: 'superiris', password: 'admin123' }).then((res) => {
      expect(res.status).toEqual(SUCCESS_STATUS);
      expect(localStorage.token).toEqual('123');
      done();
    });
  });*/
  it('Signs up a user when info is provided', (done) => {
    jest.setTimeout(10000);
    console.log(
      'WARNING: this unit test is querying Firebase real staging project. If it is executed too much, it can cause costs.'
    );
    middlewareSetup();
    auth
      .signup({
        fullName: 'Dev Iris',
        email: 'unit-test@iris.com',
        username: 'superiris-unit-test',
        country: 'Mexico',
        password: 'Admin123',
        passwordConfirmation: 'Admin123',
        birthDateDD: '26',
        birthDateMM: '8',
        birthDateYYYY: '1982',
        signupMethod: 'CUSTOM_AUTH',
      })
      .then((res) => {
        expect(res.status).toEqual(SUCCESS_STATUS);
        auth
          .removeUser()
          .then(() => {
            done();
          })
          .catch((error) => console.log('Error when removing user', error));
      })
      .catch((error) => console.log('Error on signup', error));
  });

  /*it('Logs in a user after signup', (done) => {
    auth
      .signup({
        username: 'username',
        fullName: 'name lastname',
        password: '123Password',
        email: 'test@test.com',
        country: 'mexico',
        test: true,
      })
      .then((res) => {
        expect(res.status).toEqual(SUCCESS_STATUS);
        expect(localStorage.token).toEqual('123');
        done();
      });
  });*/
});
