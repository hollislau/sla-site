const app = require(__dirname + '/_server');
const config = require(__dirname + '/config');

app(config.port, config.mongoDbUri, () => {
  process.stdout.write('Server up on port ' + config.port + '!\n');
});
