
const Todo = require('../models/todo')
const Category = require('../models/category')
const User = require('../models/user')

const createTodo = async (data) => {
    console.log(data, "data")
    return await Todo.create(data);
}

const getAllTodo = async () => {
    return await Todo.find().populate("category").populate("user");
}

const getCategory = async () => {
    return await Category.find();
}

const deleteTodo = async (id, data) => {
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

const createCategory = async (data) => {
    console.log("Call service")
    return await Category.create(data)
}

const createUser = async(data) => {
    console.log("Call service");
    console.log(data)
    return await User.create(data);
}

const getUserTodo = async(userId) => {
    console.log("getUser Todo call in service");
    const todo = await Todo.find({user: userId})
    console.log(todo);
    return await Todo.find({user: userId})
}


module.exports = {
    createTodo,
    deleteTodo,
    updateTodo,
    getAllTodo,
    searchTodo,
    createCategory,
    getCategory,
    createUser,
    getUserTodo,
    // getInitialCategory,
}