const app = require(__dirname + '/_server');
const config = require(__dirname + '/config');

app.connectDb(config.mongoDbUri, (err, mongoDbUri) => {
  if (err) {
    process.stderr.write('Database connection error at ' + mongoDbUri + ': ' + err.message + '!\n');
    return;
  }

  process.stdout.write('Database connected at ' + mongoDbUri + '!\n');
});

app.startServer(config.port, (port) => process.stdout.write('Server up on port ' + port + '!\n'));
