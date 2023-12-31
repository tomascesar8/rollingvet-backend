const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('pet').populate('turnos');
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Error al buscar usuarios' });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    if (newUser.password.length < 6 || newUser.password.length > 30) {
      res.status(400).json({ ok: false, message: 'La contraseña debe tener entre 6 y 30 caracteres' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ ok: true, message: 'Usuario creado exitosamente', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al guardar el usuario' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Cambiado de req.body a req.params
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    console.log(user);
    res.status(200).json({ ok: true, message: 'Usuario actualizado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al actualizar el usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Cambiado de req.body._id a req.params.id
    const user = await User.findByIdAndDelete(id);
    console.log(user);
    res.status(200).json({ ok: true, message: 'Usuario eliminado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al eliminar el usuario' });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log(req.headers);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ ok: false, message: 'Usuario no encontrado' });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ ok: false, message: 'Contraseña incorrecta' });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
    console.log(token);
    console.log(user);
    res.status(200).json({ ok: true, message: 'Usuario autenticado exitosamente', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Error al autenticar el usuario' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};
