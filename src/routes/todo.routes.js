
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controllers')
    
router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodo);
router.get('/:id', todoController.getTodo);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id', todoController.updateTodo)

module.exports = router;