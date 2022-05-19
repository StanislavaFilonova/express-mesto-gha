const router = require('express').Router();

const {
  getUsers,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { validatyAvatar, validatyUser } = require('../middlewares/validity');

router.get('/users/me/', getCurrentUser);
router.get('/users/:userId', getUsers);
router.get('/users', getUsers);
router.patch('/users/me', validatyUser, updateProfile);
router.patch('/users/me/avatar', validatyAvatar, updateAvatar);

module.exports = router;
