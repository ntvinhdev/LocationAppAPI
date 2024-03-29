const userRepository = require('../repositories/user');
const groupRepository = require('../repositories/group');

function updateUserLatlng(groupId, userId, latlng, callback) {
  userRepository.findById(userId, (err, user) => {
    if (err) {
      callback(err, {
        status_code: 422,
        success: false,
        status_message: err.message,
      });
    } else if (user == null) {
      callback(new Error('422'), {
        status_code: 422,
        success: false,
        status_message: 'User not found.',
      });
    } else {
      user.latlng.lat = latlng.lat;
      user.latlng.lng = latlng.lng;
      user.save();
      callback(null, {
        group_id: groupId,
        user_id: userId,
        latlng,
      });
    }
  });
}

function getUsersLatlng(groupId, callback) {
  groupRepository.findById(groupId)
    .populate('users')
    .populate('latlng')
    .exec((err, group) => {
      if (err) {
        callback(err, {
          status_code: 422,
          success: false,
          status_message: err.message,
        });
      } else if (group == null) {
        callback(new Error('422'), {
          status_code: 422,
          success: false,
          status_message: 'Group not found.',
        });
      } else {
        const users = group.users;
        let locations = [];
        for (let i = 0; i < users.length; i += 1) {
          if (users[i].latlng != null) {
            locations.push({
              _id: users[i]._id,
              username: users[i].username,
              latlng: users[i].latlng,
            });
          }
        }
        callback(null, {
          group_id: groupId,
          latlngs: locations,
        });
      }
    });
}

module.exports = {
  updateUserLatlng,
  getUsersLatlng,
};
