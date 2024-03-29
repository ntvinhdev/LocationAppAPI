const userRepository = require('../repositories/user');

function getUserInfo(userId, callback) {
  // TODO Need to add select()
  userRepository.findById(userId)
    .populate({ path: 'friends', model: 'User', select: 'username fullname avatar_url' })
    .populate({ path: 'friend_requests', model: 'User', select: 'username fullname avatar_url' })
    .populate({ path: 'friend_pendings', model: 'User', select: 'username fullname avatar_url' })
    .exec((err, user) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else {
        callback(null, {
          user_id: user._id,
          username: user.username,
          fullname: user.fullname,
          avatar_url: user.avatar_url,
          phone: user.phone,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          city: user.city,
          friends: user.friends,
          friend_pendings: user.friend_pendings,
          friend_requests: user.friend_requests,
        });
      }
    });
}

function addDevice(userId, device) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { $push: { devices: device } })
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Add device Successfully!',
          });
        }
      });
  });
}

function removeDevice(userId, device) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { $pullAll: { devices: [device] } })
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Remove device Successfully!',
          });
        }
      });
  });
}

function updateAvatar(userId, avatarUrl) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId, { avatar_url: avatarUrl })
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Update avatar successfully.',
          });
        }
      });
  });
}

function readLatlngByUserId(userId) {
  return new Promise((resolve, reject) => {
    userRepository.findById(userId)
      .select('latlng')
      .exec((error, user) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(user);
        }
      });
  });
}

function pushOneGroupRequestByUserId(userId, { groupId }) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId,
      { $push: { group_requests: groupId } },
      { new: true })
      .select('')
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            status_code: 200,
            success: true,
            status_message: 'Add user into group successfully.',
          });
        }
      });
  });
}

function readGroupRequestsByUserId(userId) {
  return new Promise((resolve, reject) => {
    userRepository.findById(userId)
      .select('group_requests')
      .populate({ path: 'group_requests', model: 'Group', select: 'name' })
      .exec((error, user) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve(user);
        }
      });
  });
}

function pullGroupRequestByUserId(userId, { groupId }) {
  return new Promise((resolve, reject) => {
    userRepository.findByIdAndUpdate(userId,
      { $pull: { group_requests: groupId } },
      { new: true })
      .select('')
      .exec((error) => {
        if (error) {
          reject(new Error(JSON.stringify({
            status_code: 422,
            success: false,
            status_message: error.message,
          })));
        } else {
          resolve({
            group_id: groupId,
          });
        }
      });
  });
}

module.exports = {
  getUserInfo,
  addDevice,
  removeDevice,
  updateAvatar,

  getUserLatlng: userId =>
    readLatlngByUserId(userId),

  addGroupRequestByUserId: ({ userId, groupId }) =>
    pushOneGroupRequestByUserId(userId, { groupId }),

  getGroupRequestsByUserId: userId =>
    readGroupRequestsByUserId(userId),

  removeGroupRequestByUserId: ({ userId, groupId }) =>
    pullGroupRequestByUserId(userId, { groupId }),
};
