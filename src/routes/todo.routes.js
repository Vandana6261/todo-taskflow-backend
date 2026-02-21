
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controllers')
    
router.post('/', todoController.createTodo);    // done
router.get('/', todoController.getAllTodo);     // done
router.get('/:id', todoController.getTodo);
router.delete('/:id', todoController.deleteTodo);   // done
router.put('/:id', todoController.updateTodo);
router.patch('/:id', todoController.updateTodoPartial);

module.exports = router;