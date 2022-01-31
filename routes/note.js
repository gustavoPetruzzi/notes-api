const router = require('express').Router();
const { body } = require('express-validator');
const noteController = require('../controllers/note');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, noteController.getNotes);

router.post(
  '/',
  isAuth,
  [
    body('title').not().isEmpty(),
    body('content').not().isEmpty(),
    body('receiverId').not().isEmpty().isNumeric(),
    body('senderId').not().isEmpty().isNumeric()
  ],
  noteController.addNotes
)
module.exports = router;
