const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiHttp = require('chai-http');
const server = require(__dirname + '/../../../_server');
const config = require(__dirname + '/../../../config');
const certConfig = require(__dirname + '/../../../cert_config');

chai.use(dirtyChai);
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Server', () => {
  before((done) => {
    this.port = 5443;
    this.server = server(this.port, null, done);
  });

  after((done) => {
    this.server.close(done);
  });

  it('should send index on GET request to root', (done) => {
    request('https://' + config.domain + ':' + this.port)
      .get('/')
      .ca(certConfig.customCa)
      .end((err, res) => {
        expect(err).to.be.null();
        expect(res).to.have.status(200);
        expect(res).to.be.html();
        expect(res.text).to.contain('Savage SLA Resources');
        done();
      });
  });
});
