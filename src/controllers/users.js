const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { use } = require("passport");

exports.register = async (req, res) => {
  try {
    const { name, profilePic, email, password, type } = req.body;

    if (!(name && email && password)) {
      res.status(400).send("Faltan campos por llenar");
    }

    const oldUser = await userModel.User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("El usuario ya existe");
    }

    let encryptedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.User.create({
      name,
      profilePic,
      email: email.toLowerCase(),
      password: encryptedPassword,
      type,
    });

    const token = jwt.sign({ userId: user._id, email }, "martin123", {
      expiresIn: "2h",
    });
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Faltan campos por llenar");
    }

    const user = await userModel.User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id, email }, "martin123", {
        expiresIn: "2h",
      });
      user.token = token;

      return res.status(200).json(user);
    }
    throw Error("Credenciales No Validas");
  } catch (err) {
    return res
      .status(404)
      .json({ error: "Usuario o contraseña incorrectos", code: 404 });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.User.find();
    return res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.User.findById(req.params.id);
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.User.findByIdAndDelete(req.params.id);
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const user = await userModel.User.findById(req.params.id);
    if (!user.courses_taken.includes(req.body)) {
      user.courses_taken.push(req.body);
    }
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
