import dotenv from "dotenv";
dotenv.config();
import express from "express";
import User from "./model/user.model.js";
import bodyParser from "body-parser";
import { connectDB } from "./Config/db.js";

const app = express();
connectDB();

const port = process.env.PORT || 3000;
app.use(bodyParser.json());

//GET USERS
app.get("/get-users", async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
  console.log(users);
});

//CREATE USER

app.post("/create-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name) {
      console.log({ statusCode: 400, message: "Name is required" });
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      console.log({ statusCode: 400, message: "email is required" });
      return res.status(400).json({ message: "email  is required" });
    }

    if (!password) {
      console.log({ statusCode: 400, message: "password is required" });
      return res.status(400).json({ message: "password  is required" });
    }

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log({ statusCode: 400, message: "Email already exists" });
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const user = new User({ fullName: name, email, password });
    const savedUser = await user.save();

    console.log({
      statusCode: 201,
      message: "User created successfully",
      data: savedUser,
    });
    res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    console.log({
      statusCode: 500,
      message: "Server internal error",
      error: err.message,
    });
    res
      .status(500)
      .json({ message: "Server internal error", error: err.message });
  }
});

//UPDATE USER
app.put("/update-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Validate user ID
    if (userId.length <= 5) {
      console.log({ statusCode: 400, message: "User ID required" });
      return res.status(400).json({ message: "User ID required" });
    }

    if (userId.length > 24) {
      console.log({ statusCode: 400, message: "Invalid User ID" });
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (userId.length > 5 && userId.length !== 24) {
      console.log({ statusCode: 400, message: "Incomplete User ID" });
      return res.status(400).json({ message: "Incomplete User ID" });
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    // Handle user not found
    if (userId.length == 24 && !user) {
      console.log({ statusCode: 404, message: "User not found" });
      return res.status(404).json({ message: "User not found" });
    }
    console.log({ statusCode: 200, message: "User updated", data: user });
    res.status(200).json({ message: "User updated", data: user });
  } catch (err) {
    console.log(err); // Log error
    res.status(500).json({ message: "Server internal error" });
  }
});

//DELETE USER

app.delete("/delete-user/:Id_", async (req, res) => {
  try {
    const { Id_ } = req.params;
    if (!Id_) {
      console.log({ statusCode: 400, message: "User ID is required" });
      return res.status(400).json({ message: "User ID is required" });
    }
    if (Id_.length !== 24) {
      console.log({ statusCode: 400, message: "Invalid User ID" });
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findByIdAndDelete(Id_);
    if (!user) {
      console.log({
        statusCode: 404,
        message: "user not found",
      });
      return res.status(404).json({ message: "User not found" });
    }
    console.log({ statusCode: 200, message: "User deleted" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log({
      statusCode: 500,
      message: "server internal error",
      error: err.message,
    });
    res
      .status(500)
      .json({ message: "server internal error", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
