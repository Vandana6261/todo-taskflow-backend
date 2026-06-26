import Todo from '../models/todo.js';
import Category from '../models/category.js';
import User from '../models/user.js';

console.log("service called");

const createTodo = async (data) => {
//   console.log(data, "data");
  return await Todo.create(data);
};

const getAllTodo = async (userId) => {
  // console.log(userId, "userId")
  const todos = await Todo.find({ 
    user: userId,
    isDeleted: false
  }).populate('category');
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

const getCategory = async (userId) => {
  console.log("getCategory in service")
  const category = await Category.find({user: userId});
  return category;
};


const searchTodo = async (userId, keyword) => {
  return await Todo.find({
    user: userId,
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }, // i means case insensitive
    ],
  }); 
};

const createCategory = async (userId, data) => {
  console.log("Call service");
  return await Category.create({user: userId, ...data});
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

export default {
  createTodo,
  deleteTodo,
  updateTodo,
  getAllTodo,
  searchTodo,
  createCategory,
  getCategory,
//   createUser,
//   getUserTodo,
  // getInitialCategory,
};
