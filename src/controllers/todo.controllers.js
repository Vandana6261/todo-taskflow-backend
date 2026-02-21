
const todoService = require('../services/todo.service')

const createTodo = async (req, res) => {
    try {
        console.log(req.body);
        const todo = await todoService.createTodo(req.body);
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getAllTodo = async (req, res) => {
    try {
        const todos = await todoService.getAllTodo();
        res.json(todos)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getTodo = async (req, res) => {
    const todo = await todoService.getTodo(req.params.id);
    res.json(todo);
}

const deleteTodo = async (req, res) => {
    console.log("deleteTodo called")
    const todo = await todoService.deleteTodo(req.params.id, req.body);
    if(!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    res.json({ message: "Todo deleted successfully" });
}

const updateTodo = async (req, res) => {
    console.log("Update todo called")
    const todo = await todoService.updateTodo(req.params.id, req.body);
    if(!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    res.json({ message: "Todo updated successfully" });
}

const updateTodoPartial = async (req, res) => {
    const todo = await todoService.updateTodoPartial(req.params.id, req.body);
    if(!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    res.json({message: "Todo updated successfully"});
}

module.exports = {
    createTodo,
    getTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    updateTodoPartial
}