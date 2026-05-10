
const express = require('express');
const router = express.Router();
const {
    createTodo,
    getAllTodo,
    getInitialCategory,
    deleteTodo,
    updateTodo,
    searchTodo,
    createCategory,
    createUser,
    getUserTodo

} = require('../controllers/todoControllers')
const { varifyToken } = require('../middleware/authMiddleware');
const { getCategory } = require('../controllers/todoControllers');

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

module.exports = router;