const bodyParser = require('body-parser').json();
const router = require('express').Router();
const basicHttp = require(__dirname + '/../lib/basic_http');
const errorHandler = require(__dirname + '/../lib/error_handler');
const User = require(__dirname + '/../models/user');

router.post('/signup', bodyParser, (req, res) => {
  var newUser;

  if (!req.body.username) return errorHandler(new Error('Missing username!'), res, 500);

  if (!req.body.password) return errorHandler(new Error('Missing password!'), res, 500);

  newUser = new User(req.body);
  newUser.generateHashPass(req.body.password);
  req.body.password = null;

  newUser.save((err, user) => {
    if (err) return errorHandler(err, res, 500, 'Could not save new user!');

    user.generateToken((err, token) => {
      if (err) return errorHandler(err, res, 500);

      res.status(200).json({ token, msg: 'New user created!' });
    });
  });
});

module.exports = exports = router;
