const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const secret = process.env.SECRET;

const authenticationLogic = (req, res, next) => {
    try {
      const data = jwt.verify(req.headers.token, secret);
      req.userInfo = { username: data.username, password: data.password };
      next();
    } catch (err) {
      res.send(err);
    }
  };

app.use(express.json());

const PORT = process.env.PORT || 5000;

const users = [];

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.post("/register", (req, res) => {
  const userData = {
    username: req.body.username,
    name: req.body.name,
    college: req.body.college,
    yearOfGraduation: req.body.yog,
    password: req.body.password,
  };

  users.push(userData);

  res.status(201).send("user registered!");
});

app.put("/users", authenticationLogic, (req, res) => {
  const userData = req.body;
  const idx = users.findIndex((user) => user.username === req.userInfo.username);
  if (idx === -1) {
    res.status(404).send("User not found");
  }
  if (users[idx].password !== req.userInfo.password) {
    res.status(401).send("invalid password....errrr!");
    return;
  }
  let user_temp = users[idx];
  users[idx] = { ...user_temp, ...userData };

  res.status(200).send("Updated Successfully");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = { username, password };

  const token = jwt.sign(user, secret, { expiresIn: "1d" });

  res.send(token);
});

app.listen(PORT, () => console.log(`server started listening at ${PORT}`));
