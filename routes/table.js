import express from "express";
const router = express.Router();
import TableController from '../controllers/TableController';


router.get('/',  TableController.getTable);
router.post('/', TableController.createTable);
router.put('/', TableController.updateTables);
router.delete('/', TableController.deleteTable);


export default router;