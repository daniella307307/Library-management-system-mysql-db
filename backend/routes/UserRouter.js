const express = require('express');
const router = express.Router();
const userControler = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const emailVerification = require('../utils/emailVerification');

router.post('/register', userControler.register);
router.post('/login', userControler.login);
router.get('/verify-email',authMiddleware, userControler.verifyEmail);
router.post('/findByEmail',authMiddleware, userControler.findByEmail);
router.get('/getAllUsers',authMiddleware, userControler.getAllUsers);
router.delete('/deleteUser/:id',authMiddleware, userControler.deleteUser);
router.put('/updateUser/:id',authMiddleware, userControler.updateUser);
router.get('/getUserById/:id',authMiddleware, userControler.getUserById);
router.post('/add',authMiddleware, userControler.addManyUsers);
module.exports = router;