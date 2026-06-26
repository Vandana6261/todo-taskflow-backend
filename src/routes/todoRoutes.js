
import express from 'express';
const router = express.Router();
import {
  createTodo,
  getAllTodo,
  // getInitialCategory,
  deleteTodo,
  updateTodo,
  searchTodo,
  createCategory,
  createUser,
  getUserTodo,
  getCategory,
} from '../controllers/todoControllers.js';
import { varifyToken } from '../middleware/authMiddleware.js';

console.log("todo routes called")

router.use(varifyToken);


router.post("/createTodo", createTodo)
router.get("/getTodo", getAllTodo);
// router.get("/getTodo", getAllTodo);
router.get('/getCat', getCategory)
router.post('/createCategory', createCategory);
router.get('/:keyword', searchTodo)  // done

router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

export default router;