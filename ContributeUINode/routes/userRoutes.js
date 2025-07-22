const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('image'), createUser);
// router.get('/', getUsers);
// router.get('/:id', getUser);
// router.put('/:id', upload.single('image'), updateUser);
// router.delete('/:id', deleteUser);

module.exports = router;
