const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const config = require(__dirname + '/../../../config');
const customCa = require(__dirname + '/../../../cert_config').customCa;
const server = require(__dirname + '/../../../_server');

chai.use(dirtyChai);
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Server', () => {
  before((done) => {
    this.server = server(config.testPort, () => {
      this.serverMsg = 'Server up on port ' + config.testPort + '!';
      done();
    });
  });

  after((done) => {
    this.server.close(done);
  });

  it('should print a confirmation message', () => {
    expect(this.serverMsg).to.eql('Server up on port ' + config.testPort + '!');
  });

  it('should send index on GET request to root', (done) => {
    request('https://' + config.domain + ':' + config.testPort)
      .get('/')
      .ca(customCa)
      .end((err, res) => {
        expect(err).to.be.null();
        expect(res).to.have.status(200);
        expect(res).to.be.html();
        expect(res.text).to.contain('Savage SLA Resources');
        done();
      });
  });
});
