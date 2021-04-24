import express from "express";

const router = express.Router();

import UsersController from "../controllers/UsersController";

router.get('/', UsersController.myAccount);
router.post('/register', UsersController.register);
router.post('/userConfirm', UsersController.userVerification);
router.post('/login', UsersController.login);
router.post('/resetPassword', UsersController.resetPassword);
router.put('/confirmEmail', UsersController.changePassword);
router.put('/update', UsersController.update);
router.delete('/:id', UsersController.delete);

export default router;
