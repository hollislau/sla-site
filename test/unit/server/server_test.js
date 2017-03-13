const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require(__dirname + '/../../../_server');
const config = require(__dirname + '/../../../config');

chai.use(dirtyChai);
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Server', () => {
  before((done) => {
    if (config.selfSignedCert) {
      this.cert = fs.readFileSync(__dirname + '/../../../ssl/certificate.pem');
    }

    this.portBackup = process.env.PORT;
    this.PORT = process.env.PORT = 5000;
    this.server = server(this.PORT, null, done);
  });

  after((done) => {
    process.env.PORT = this.portBackup;
    this.server.close(done);
  });

  it('should send index on GET request to root', (done) => {
    request('https://localhost:' + this.PORT)
      .get('/')
      .ca(this.cert)
      .end((err, res) => {
        expect(err).to.be.null();
        expect(res).to.have.status(200);
        expect(res).to.be.html();
        expect(res.text).to.contain('Savage SLA Resources');
        done();
      });
  });
});
