const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const connectDb = require(__dirname + '/../../_server').connectDb;
const mongoDbTestUri = require(__dirname + '/../../config').mongoDbTestUri;
const User = require(__dirname + '/../../models/user');

chai.use(dirtyChai);

const expect = chai.expect;

describe('User ID hash method', () => {
  before((done) => {
    var newUser;

    connectDb(mongoDbTestUri, (err) => {
      if (err) throw err;
    });

    newUser = new User({ username: 'testuser', password: 'testpassword' });

    newUser.save((err, user) => {
      if (err) throw err;

      this.user = user;
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(done);
    });
  });

  it('should create a random hash', (done) => {
    this.user.generateHash((err, hash) => {
      expect(err).to.be.null();
      expect(hash).to.have.length.above(0);
      expect(hash).to.eql(this.user.idHash);
      done();
    });
  });

  it('should make 5 attempts and return an error', (done) => {
    const stub = sinon.stub(this.user, 'save').yields(new Error('error'));

    this.user.generateHash((err, hash, tries) => {
      stub.restore();
      expect(err).to.exist();
      expect(err.message).to.eql('Could not save user ID hash!');
      expect(hash).to.be.null();
      expect(tries).to.eql(5);
      done();
    }, 10);
  });
});
