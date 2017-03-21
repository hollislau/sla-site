const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const mongoDbTestUri = require(__dirname + '/../../../config').mongoDbTestUri;
const User = require(__dirname + '/../../../models/user');

chai.use(dirtyChai);

const expect = chai.expect;

describe('User ID hash method', () => {
  before((done) => {
    var newUser;

    mongoose.connect(mongoDbTestUri);
    newUser = new User({ username: 'testuser', password: 'testpassword' });

    newUser.save((err, data) => {
      if (err) throw err;

      this.user = data;
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
      expect(err).to.exist();
      expect(err.message).to.eql('Unable to save user ID hash!');
      expect(hash).to.be.null();
      expect(tries).to.eql(5);
      stub.restore();
      done();
    }, 10);
  });
});
