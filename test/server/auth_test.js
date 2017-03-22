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

    it('should require a new user name', (done) => {
      request('https://' + config.domain + ':' + config.testPort)
        .post('/api/signup')
        .send({ username: '', password: 'testpassword' })
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('No username!');
          done();
        });
    });

    it('should require a new password', (done) => {
      request('https://' + config.domain + ':' + config.testPort)
        .post('/api/signup')
        .send({ username: 'testuser', password: '' })
        .end((err, res) => {
          expect(err).to.exist();
          expect(res).to.have.status(500);
          expect(res.body.msg).to.eql('No password!');
          done();
        });
    });

    it('should return an error if new user is not saved', (done) => {
      const stub = sinon.stub(User.prototype, 'save').yields(new Error('error'));

      request('https://' + config.domain + ':' + config.testPort)
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

    it('should create a new user', (done) => {
      request('https://' + config.domain + ':' + config.testPort)
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
});
