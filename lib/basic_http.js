const errorHandler = require(__dirname + '/error_handler');

module.exports = exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const namePassEnc = authHeader.split(' ')[1];
    const namePassBuf = Buffer.from(namePassEnc, 'base64');
    const namePassPT = namePassBuf.toString();
    const namePassArr = namePassPT.split(':');

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
