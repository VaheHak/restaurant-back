var express = require('express');
var router = express.Router();

router.get('/', UsersController.myAccount);
router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
// router.put('/', UsersController.update);
// router.delete('/', UsersController.delete);

module.exports = router;
