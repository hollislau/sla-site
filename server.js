const app = require(__dirname + '/_server');
const PORT = process.env.PORT || 3000;

app(PORT, () => process.stdout.write('Server up on port ' + PORT + '!\n'));
