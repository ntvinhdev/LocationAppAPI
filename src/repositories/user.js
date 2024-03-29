const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  password: String,
  password_hash: String,
  avatar_url: String,
  phone: Number,
  email: String,
  gender: String, // Male, Female, Other
  birthday: Number,
  city: String,
  latlng: {
    lng: Number,
    lat: Number,
  },
  devices: [
    {
      token: String,
      date: Number,
    },
  ],
  friend_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friend_pendings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  group_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
