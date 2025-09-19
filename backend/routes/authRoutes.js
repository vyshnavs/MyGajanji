const express = require('express');
const router = express.Router();
const { register, verify, login,logout } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleController');

router.post('/register', register);
router.get('/verify/:token', verify);
router.post('/login', login);
router.post('/logout', logout);

router.post('/google-login', googleLogin);

module.exports = router;

