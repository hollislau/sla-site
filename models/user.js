const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const jwtSecret = require(__dirname + '/../config').jwtSecret;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  idHash: { type: String, unique: true }
});

mongoose.Promise = global.Promise;

userSchema.methods.generateHashPass = function (password) {
  return this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHashPass = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateHash = function (cb, delay) {
  var timeout;
  var tries = 0;

  const timeoutDelay = delay || 1000;

  const _generateHash = () => {
    const hash = crypto.randomBytes(32);

    this.idHash = hash.toString('hex');

    this.save((err) => {
      if (err) {
        if (tries > 4) return cb(new Error('Unable to save user ID hash!'), null, tries);

        return timeout = setTimeout(() => {
          _generateHash();
          tries++;
        }, timeoutDelay);
      }

      if (timeout) clearTimeout(timeout);

      cb(null, this.idHash);
    });
  };

  _generateHash();
};

userSchema.methods.generateToken = function (cb) {
  this.generateHash((err, hash) => {
    if (err) return cb(err);

    cb(null, jwt.sign({ idd: hash }, jwtSecret, { expiresIn: '1d' }));
  });
};

module.exports = exports = mongoose.model('User', userSchema);
