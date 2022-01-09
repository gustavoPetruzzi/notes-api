const router = require('express').Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, userController.getUsers);


module.exports = router;
