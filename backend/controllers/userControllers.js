import asyncHandlers from "express-async-handler";
import User from "../models/userModel";
import generateToken from "../config/generateToken";

const registerUser = asyncHandlers(async (req, res) => {
  // Registers users.

  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All Required Details");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }
});
  } else {
    res.status(400);
    throw new Error("Failed To Create User!");
  }
});

const authUser = asyncHandlers(async (req, res) => {
  // Authenticates a user.

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const allUser = asyncHandlers(async (req, res) => {
  // Retrieves all users excluding the logged-in user, based on search query.

  const searchRegex = new RegExp(req.query.search, "i");
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUser };
