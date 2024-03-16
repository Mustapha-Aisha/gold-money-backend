const User = require("../../models/users/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
  }
  const user = await User.findOne({ email });
  // compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "15min" }
    );
    res.status(200).json({
        message: 'User successfully authenticated', accessToken });
  } else {
    res.status(401).json({ error: "email or password is not valid" });
  }
};

const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    res.status(400).json({ error: "All fields are required" });
    // throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return res.status(400).json({ error: "User already registered" });
    // throw new Error("User already registered");
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(`Hashed password: ${hashedPassword}`);
  // let data = await new User(user).save();
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
        message: "User created succesfully",
        data: {
            _id: user.id,
            email: user.email,
            username: user.username,
        }
    });
  } else {
    res.status(400).json({ error: "User data is not valid" });
  }
};

const currentUser = async (req, res) => {
  res.json({
    message: "User gotten successfully",
    data:req.user
});
};

const forgotPassword = async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    res.status(400).json({ error: "User not found" });
  } else {
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        res.status(400).json({ error: "New password must not be the same as old password" });
      } else {
        const newPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.params.id, {$set: { password: newPassword }}, { new: true });
        res.status(200).json({ message: "Password changed successfully" });
      }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


module.exports = {
  userLogin,
  createUser,
  forgotPassword,
  currentUser,
};