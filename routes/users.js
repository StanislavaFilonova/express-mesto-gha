const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', getCurrentUser);
router.post('/users', createUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
