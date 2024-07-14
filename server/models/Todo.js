// ./models/Todo.js
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  checked: { type: Boolean, default: false },
  category: { type: String, default: "Other" },
  tags: { type: [String], default: [] },
  dueDate: { type: Date },
  priority: { type: String, default: "Medium" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
