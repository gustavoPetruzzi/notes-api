const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ value })
          .then(userDoc => {
            if (userDoc) {
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('email address already existed');
            }
          })
          .catch(err => {
            console.log('error', err);
          })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('nickname')
      .trim()
      .isLength({ min: 5 })
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
