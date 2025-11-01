const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController');
const Usuario = require('../models/userModel');

// Importar middleware
const { verifyToken } = userController;

router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));

router.post('/login', userController.login);
router.post('/register', userController.register);

// 🔹 Vista para registrar admin (protegida)
router.get('/register_admin', verifyToken, async (req, res) => {
  try {
    const users = await Usuario.find();
    res.render('register_admin', { user: req.user || {}, users, error: null }); // ✅ asegúrate que 'user' nunca sea undefined
  } catch (error) {
    res.render('register_admin', { user: req.user || {}, users: [], error: 'Error al cargar usuarios' });
  }
});

// 🔹 Registrar nuevo usuario desde el panel admin
router.post('/register_admin', verifyToken, async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ nombre, apellido, email, password: hashedPassword, rol });
    await nuevoUsuario.save();

    const users = await Usuario.find();
    res.render('register_admin', { user: req.user || {}, users, error: null });
  } catch (error) {
    const users = await Usuario.find();
    res.render('register_admin', { user: req.user || {}, users, error: 'Error al registrar usuario' });
  }
});

// 🔹 Dashboard principal
router.get('/dashboard', verifyToken, async (req, res) => {
  const users = await Usuario.find();
  res.render('dashboard', { usuario: req.user || {}, users });
});

// 🔹 Dashboard de mesero
router.get('/dashboard_mesero', verifyToken, async (req, res) => {
  try {
    const users = await Usuario.find();
    res.render('dashboard_mesero', {
      usuario: req.user || {},
      users,
      error: null
    });
  } catch (error) {
    res.render('dashboard_mesero', {
      usuario: req.user || {},
      users: [],
      error: 'Error al cargar usuarios'
    });
  }
});

//  Dashboard de cajero
router.get('/dashboard_cajero', verifyToken, async (req, res) => {
  try {
    const users = await Usuario.find();
    res.render('dashboard_cajero', {
      usuario: req.user || {},
      users,
      error: null
    });
  } catch (error) {
    res.render('dashboard_cajero', {
      usuario: req.user || {},
      users: [],
      error: 'Error al cargar usuarios'
    });
  }
});

// 🔹 Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
