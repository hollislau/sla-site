const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const config = require(__dirname + '/../../../config');
const app = require(__dirname + '/../../../_server');

chai.use(dirtyChai);
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Server', () => {
  before((done) => {
    this.server = app.startServer(config.testPort, () => done());
  });

  afterEach((done) => {
    this.server.close(done);
  });

  it('should send index on GET request to root', (done) => {
    request('https://' + config.domain + ':' + config.testPort)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null();
        expect(res).to.have.status(200);
        expect(res).to.be.html();
        expect(res.text).to.contain('Savage SLA Resources');
        done();
      });
  });

  it('should return port number for logging', (done) => {
    this.server = app.startServer(config.testPort, (port) => {
      expect(port).to.eql(config.testPort);
      done();
    });
  });
});

describe('Database', () => {
  afterEach((done) => {
    mongoose.disconnect(done);
  });

  it('should return database URI for logging', (done) => {
    app.connectDb(config.mongoDbTestUri, (err, mongoDbUri) => {
      expect(err).to.be.null();
      expect(mongoDbUri).to.eql(config.mongoDbTestUri);
      done();
    });
  });

  it('should attempt 10 connections and return an error', (done) => {
    const stub = sinon.stub(mongoose, 'connect').yields(new Error('error'));

    app.connectDb(config.mongoDbTestUri, (err, mongoDbUri, tries) => {
      expect(err).to.exist();
      expect(mongoDbUri).to.eql(config.mongoDbTestUri);
      expect(tries).to.eql(10);
      stub.restore();
      done();
    }, 10);
  });
});
