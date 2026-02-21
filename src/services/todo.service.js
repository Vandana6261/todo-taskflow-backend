
const Todo = require('../models/todo.model')

const createTodo = async (data) => {
    return await Todo.create(data);
}

const getAllTodo = async () => {
    return await Todo.find();
}

const getTodo = async (id) => {
    return await Todo.findById(id);
}

const deleteTodo = async (id, data) => {
    // return await Todo.findByIdAndDelete(id);
    return await Todo.findByIdAndUpdate(id, data, {new: true});
}

const updateTodo = async (id, data) => {
    return await Todo.findByIdAndUpdate(id, data, { new: true});
}

const updateTodoPartial = async (id, data) => {
    return await Todo.findByIdAndUpdate(id, data, {new: true});
}

module.exports = {
    createTodo,
    getTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    updateTodoPartial
}