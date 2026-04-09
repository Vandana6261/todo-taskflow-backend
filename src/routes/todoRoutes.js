
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

console.log("todo routes called")

// router.post('/', createTodo);    // done

// router.get('/', getAllTodo);     // done
// router.get('/getCat', getInitialCategory);     // done

// router.delete('/:id', deleteTodo);   // done

// router.put('/:id', updateTodo);      //done

// router.get('/:keyword', searchTodo)  // done

// router.post('/createCategory', createCategory);
// router.post('/signUp', createUser);

// router.get('/getUserTodo/:userId', getUserTodo);

router.post("/createTodo", varifyToken, createTodo)
router.get("/getTodo", varifyToken, getAllTodo);
router.delete("/:id", varifyToken, deleteTodo);
router.put("/:id", varifyToken, updateTodo)

module.exports = router;