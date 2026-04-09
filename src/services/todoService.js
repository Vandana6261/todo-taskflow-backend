const Todo = require("../models/todo");
const Category = require("../models/category");
const User = require("../models/user");

console.log("service called");

const createTodo = async (data) => {
//   console.log(data, "data");
  return await Todo.create(data);
};

const getAllTodo = async (userId) => {
  // console.log(userId, "userId")
  const todos = await Todo.find({ user: userId });
  return todos;
};

const deleteTodo = async (todoId, userId) => {
//   return await Todo.findByIdAndUpdate(id, data, { new: true });

    const updatedTodo = await Todo.findOneAndUpdate(
        {_id: todoId, user: userId},
        {$set: {isDeleted: true}},
        {new: true}
    );
    return updatedTodo;
};

const updateTodo = async (todoId, userId, data) => {
//   return await Todo.findByIdAndUpdate(id, data, { new: true });
  const updatedTodo = Todo.findOneAndUpdate(
    {_id: todoId, user: userId},
    {$set: data},
    {new: true}
  )
  return updatedTodo;
};

const getCategory = async () => {
  return await Category.find();
};


const searchTodo = async (keyword) => {
  return await Todo.find({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }, // i means case insensitive
    ],
  });
};

const createCategory = async (data) => {
  console.log("Call service");
  return await Category.create(data);
};

const createUser = async (data) => {
  console.log("Call service");
  console.log(data);
  return await User.create(data);
};

const getUserTodo = async (userId) => {
  console.log("getUser Todo call in service");
  const todo = await Todo.find({ user: userId });
  console.log(todo);
  return await Todo.find({ user: userId });
};

module.exports = {
  createTodo,
  deleteTodo,
  updateTodo,
  getAllTodo,
//   searchTodo,
//   createCategory,
//   getCategory,
//   createUser,
//   getUserTodo,
  // getInitialCategory,
};
