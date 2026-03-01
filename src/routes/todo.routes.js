
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controllers')
    
router.post('/', todoController.createTodo);    // done
router.get('/', todoController.getAllTodo);     // done
router.get('/getCat', todoController.getInitialCategory);     // done
router.delete('/:id', todoController.deleteTodo);   // done
router.put('/:id', todoController.updateTodo);      //done
router.get('/:keyword', todoController.searchTodo)  // done
router.post('/createCategory', todoController.createCategory);

router.patch('/:id', todoController.updateTodoPartial);

module.exports = router;