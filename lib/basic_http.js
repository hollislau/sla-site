var errorHandler = require(__dirname + '/error_handler');

module.exports = exports = function (req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    var namePassword = authHeader.split(' ')[1];
    var namePassBuf = new Buffer(namePassword, 'base64');
    var namePassPT = namePassBuf.toString();
    var namePassArr = namePassPT.split(':');

    namePassBuf.fill(0);

    req.auth = {
      username: namePassArr[0],
      password: namePassArr[1]
    };

    if (!req.auth.username.length || !req.auth.password.length) {
      throw new Error('Missing username or password!');
    }
  } catch (e) {
    return errorHandler(e, res, 401);
  }

  next();
};
