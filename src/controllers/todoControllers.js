const todoService = require("../services/todoService");
const seedDefaultCategories = require("../seed/seedCategories")

const createTodo = async (req, res) => {
  console.log("createTodo")
  try {
    const todoData = {...req.body, user: req.userId};
    const todo = await todoService.createTodo(todoData);
    res.status(201).json(todo);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getAllTodo = async (req, res) => {
  console.log("getAllTodo controller")
  try {
    const response = await todoService.getAllTodo(req.userId);
    return res.json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  console.log("getCategory in controller")
  try {
    // await seedDefaultCategories();
    const category = await todoService.getCategory(req.userId)
    return res.json({
      categories: category
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}

const deleteTodo = async (req, res) => {
  console.log("deleteTodo called");
  try {
    // console.log(req.params.id, req.userId)
    const todo = await todoService.deleteTodo(req.params.id, req.userId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message})
  }
};

const updateTodo = async (req, res) => {
  console.log("Update todo called");
  try {
    const todo = await todoService.updateTodo(req.params.id, req.userId, req.body);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const searchTodo = async (req, res) => {
  console.log("Search todo called");
  try {
    // console.log(req.userId, "userId")
    const todo = await todoService.searchTodo(req.userId, req.params.keyword);
    console.log(todo)
    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }
    res.status(200).json({success: true, message: "Todo found", todo});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  console.log("Create Category is called");
  try {
    const category = await todoService.createCategory(req.userId, req.body);
    return res.status(200).json(category)
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: error.message})
  }
};

const createUser = async (req, res) => {
  console.log("SignUp called")
  try {
    const user = await todoService.createUser(req.body);
    return res.status(200).json(user)
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: error.message})
  }
}

const getUserTodo = async (req, res) => {
  console.log("getUserTodo")
  try {
    const userTodos = await todoService.getUserTodo(req.params.userId);
    return res.status(200).json(userTodos)
  } catch (error) {
    console.log(error);
    return res.json(500).json({message: error.message})
  }
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
};
