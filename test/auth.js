const User = require('../models/user');
const expect = require('chai').expect;
const AuthController = require('../controllers/auth');
const sequelize = require('../utils/database-test');
const { firstDummyUser } = require('./dummy/dummy-users');
describe('Auth controller', function () {
  before(function (done) {
    sequelize
      .sync()
      .then(() => {
        console.log('connected');
        done();
      })
      .catch((error) => console.log('Something failed ', error));
  });
  it('Should create a new user', function () {
    const req = {
      body: {
        ...firstDummyUser
      }
    };
    console.log(req);
    const res = {
      statusCode: 500,
      message: '',
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        return this;
      }
    }
    return AuthController.signup(req, res, () => {}).then((response) => {
      expect(response.statusCode).to.be.equal(201);
      expect(response.message).to.be.equal('User created.');
    })
  })
  it('Should throw an error if an email is already registered', function () {
    const req = {
      body: {
        ...firstDummyUser
      }
    };
    const res = {
      statusCode: 500,
      message: '',
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        return this;
      }
    };

    return AuthController.signup(req, res, () => {}).then((response) => {
      expect(response.statusCode).to.be.equal(409);
      expect(response.message).to.be.equal('Email already registered');
    });
  });
  it('Should login if email and password are registered', function () {
    const req = {
      body: {
        email: firstDummyUser.email,
        password: firstDummyUser.password
      }
    };
    const res = {
      statusCode: 500,
      message: '',
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        return this;
      }
    };

    return AuthController.login(req, res, () => {}).then((response) => {
      expect(response.statusCode).to.be.equal(200);
    });
  });

  it('Should throw an error if the password is wrong', function () {
    const req = {
      body: {
        email: firstDummyUser.email,
        password: 'wrong password'
      }
    };
    const res = {
      statusCode: 500,
      message: '',
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        return this;
      }
    };

    return AuthController.login(req, res, () => {}).then((response) => {
      expect(response.statusCode).to.be.equal(401);
      expect(response.message).to.be.equal('Wrong password');
    });
  })
  after(function () {
    return User.destroy({
      where: {
        email: 'test@test.com'
      }
    })
      .catch((error) => console.log(error));
  })
})
