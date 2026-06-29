import express from 'express';
import {
  createTodo,
  getAllTodo,
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

const router = express.Router();
router.use(varifyToken);


router.post("/createTodo", createTodo)
router.get("/getTodo", getAllTodo);
router.get('/getCat', getCategory)
router.post('/createCategory', createCategory);
router.get('/:keyword', searchTodo)
router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

export default router;