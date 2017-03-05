const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
chai.use(dirtyChai);
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const server = require(__dirname + '/../../../_server');

describe('Server', () => {
  before((done) => {
    this.portBackup = process.env.PORT;
    this.PORT = process.env.PORT = 5000;
    this.server = server(this.PORT, null, done);
  });

  after((done) => {
    process.env.PORT = this.portBackup;
    this.server.close(done);
  });

  it('should send index on GET request to root', (done) => {
    request('localhost:' + this.PORT)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null();
        expect(res).to.have.status(200);
        expect(res).to.be.html();
        expect(res.text).to.contain('Savage SLA Resources');
        done();
      });
  });
});
