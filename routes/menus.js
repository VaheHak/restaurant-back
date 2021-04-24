import express from "express";

const router = express.Router();
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()})

import MenusController from "../controllers/MenusController";

router.get('/', MenusController.menus);
router.post('/', upload.single('logo'), MenusController.createMenu);
router.put('/', upload.single('logo'), MenusController.updateMenu);
router.delete('/', MenusController.deleteMenu);

export default router;
