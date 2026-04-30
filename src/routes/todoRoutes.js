
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

// router.post('/', createTodo);    // done

// router.get('/', getAllTodo);     // done
// router.get('/getCat', getInitialCategory);     // done

// router.delete('/:id', deleteTodo);   // done

// router.put('/:id', updateTodo);      //done

// router.get('/:keyword', searchTodo)  // done

// router.post('/createCategory', createCategory);
// router.post('/signUp', createUser);

// router.get('/getUserTodo/:userId', getUserTodo);

router.post("/createTodo", createTodo)
router.get("/getTodo", getAllTodo);
// router.get("/getTodo", getAllTodo);
router.get('/getCat', getCategory)

router.delete("/:id", deleteTodo);
router.put("/:id", updateTodo);

module.exports = router;