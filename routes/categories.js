import express from "express";
const router = express.Router();
import CategoriesController from "../controllers/CategoriesController";
import multer from 'multer';

const upload = multer({storage:multer.memoryStorage()})

router.get('/',  CategoriesController.getCategories);
router.post('/', upload.single('image'), CategoriesController.createCategories);
router.put('/', upload.single('image'), CategoriesController.updateCategories);
router.delete('/', CategoriesController.deleteCategories);


export default router;