const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const config = require(__dirname + '/../../config');
const app = require(__dirname + '/../../_server');
const User = require(__dirname + '/../../models/user');

chai.use(dirtyChai);
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;
const testUrl = 'https://' + config.domain + ':' + config.testPort;

describe('Authentication resource', () => {
  before((done) => {
    app.connectDb(config.mongoDbTestUri, (err) => {
      if (err) throw err;
    });

    this.server = app.startServer(config.testPort, () => done());
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        this.server.close(done);
      });
    });
  });

  describe('sign up route', () => {
    after((done) => {
      mongoose.connection.db.dropDatabase(done);
    });

    it('should require a new username', (done) => {
      request(testUrl)
        .post('/api/signup')
        .send({ username: '', password: 'testpassword' })
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Missing username!');
          done();
        });
    });

    it('should require a new password', (done) => {
      request(testUrl)
        .post('/api/signup')
        .send({ username: 'testuser', password: '' })
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Missing password!');
          done();
        });
    });

    it('should return an error if new user is not saved', (done) => {
      const stub = sinon.stub(User.prototype, 'save').yieldsAsync(new Error('error'));

      request(testUrl)
        .post('/api/signup')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          stub.restore();
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Could not save new user!');
          done();
        });
    });

    it('should retun an error if user ID hash is not saved', (done) => {
      const stub = sinon.stub(User.prototype, 'generateHash').yieldsAsync(new Error('Test error'));

      request(testUrl)
        .post('/api/signup')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          stub.restore();
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Test error');
          mongoose.connection.db.dropDatabase(done);
        });
    });

    it('should create a new user', (done) => {
      request(testUrl)
        .post('/api/signup')
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          expect(err).to.be.null();
          expect(res).to.have.status(200);
          expect(res.body.token).to.exist();
          expect(res.body.msg).to.eql('New user created!');
          done();
        });
    });
  });

  describe('sign in route', () => {
    before((done) => {
      const newUser = new User({ username: 'testuser', password: 'testpassword' });

      newUser.generateHashPass(newUser.password);

      newUser.save((err) => {
        if (err) throw err;

        done();
      });
    });

    it('should require a username', (done) => {
      request(testUrl)
        .get('/api/signin')
        .auth('', 'testpassword')
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('Missing username or password!');
          done();
        });
    });

    it('should require a password', (done) => {
      request(testUrl)
        .get('/api/signin')
        .auth('testuser', '')
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('Missing username or password!');
          done();
        });
    });

    it('should return an error on a database error', (done) => {
      const stub = sinon.stub(mongoose.Model, 'findOne').yieldsAsync(new Error('error'));

      request(testUrl)
        .get('/api/signin')
        .auth('testuser', 'testpassword')
        .end((err, res) => {
          stub.restore();
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Database error!');
          done();
        });
    });

    it('should require a valid username', (done) => {
      request(testUrl)
        .get('/api/signin')
        .auth('baduser', 'testpassword')
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('Incorrect username or password!');
          done();
        });
    });

    it('should require a valid password', (done) => {
      request(testUrl)
        .get('/api/signin')
        .auth('testuser', 'badpassword')
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('Incorrect username or password!');
          done();
        });
    });

    it('should retun an error if user ID hash is not saved', (done) => {
      const stub = sinon.stub(User.prototype, 'generateHash').yieldsAsync(new Error('Test error'));

      request(testUrl)
        .get('/api/signin')
        .auth('testuser', 'testpassword')
        .end((err, res) => {
          stub.restore();
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('Test error');
          done();
        });
    });

    it('should sign in an existing user', (done) => {
      request(testUrl)
        .get('/api/signin')
        .auth('testuser', 'testpassword')
        .end((err, res) => {
          expect(err).to.be.null();
          expect(res).to.have.status(200);
          expect(res.body.token).to.exist();
          expect(res.body.msg).to.eql('Login successful!');
          done();
        });
    });
  });
});
