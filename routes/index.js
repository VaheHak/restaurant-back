import express from "express";
const router = express.Router();

import users from "./users";
import restaurant from "./restaurant";
import menus from "./menus";

router.use('/users', users);
router.use('/restaurant', restaurant);
router.use('/menus', menus);

export default router;
