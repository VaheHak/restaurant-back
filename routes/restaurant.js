import express from "express";

const router = express.Router();
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()})

import RestaurantController from "../controllers/RestaurantController";

router.get('/', RestaurantController.restaurant);
router.post('/', upload.single('logo'), RestaurantController.postRestaurant);
router.put('/', upload.single('logo'), RestaurantController.updateRestaurant);
router.delete('/', RestaurantController.deleteRestaurant);

export default router;
