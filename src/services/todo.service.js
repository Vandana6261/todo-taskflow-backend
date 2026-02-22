
const Todo = require('../models/todo.model')

const createTodo = async (data) => {
    return await Todo.create(data);
}

const getAllTodo = async () => {
    return await Todo.find();
}

const deleteTodo = async (id, data) => {
    // return await Todo.findByIdAndDelete(id);
    return await Todo.findByIdAndUpdate(id, data, {new: true});
}

const updateTodo = async (id, data) => {
    return await Todo.findByIdAndUpdate(id, data, { new: true});
}

const searchTodo = async (keyword) => {
    return await Todo.find({
        $or: [
            {title: {$regex : keyword, $options: 'i'}},
            {description: { $regex: keyword, $options: 'i'}}     // i means case insensitive
        ]
    });
}

const updateTodoPartial = async (id, data) => {
    return await Todo.findByIdAndUpdate(id, data, {new: true});
}

module.exports = {
    createTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    searchTodo,
    updateTodoPartial
}