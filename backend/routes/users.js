const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', protect, isAdmin, userController.getUsers);
router.post('/', protect, isAdmin, userController.createUser);

module.exports = router;
