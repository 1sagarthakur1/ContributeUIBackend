const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sjdfliesdjflioewjfkdsjfoiejflksjfdoawe;flsdfkhdfiuew';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1d' });
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, image: imageUrl } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required. User not added.',
      });
    }

    let image = '';
    if (req.file) {
      image = req.file.filename;
    } else if (imageUrl) {
      image = imageUrl;
    }

    // Check if user exists
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({ name, email, image });
      isNewUser = true;
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: isNewUser ? 'User created successfully' : 'User already exists',
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

exports.updateUser = async (req, res) => {
  const { name, email } = req.body;
  const image = req.file?.filename;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  if (image) user.image = image;

  const updated = await user.save();
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ message: 'Deleted successfully' });
};
