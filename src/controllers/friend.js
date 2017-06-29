const express = require('express');
const friendModel = require('../models/friend');
const authMiddleware = require('../middlewares/auth');
const notificationDomain = require('../domains/notification');

const router = express.Router();

router.use(authMiddleware.isUserAuthenticated);

router.get('', (req, res) => {
  const userId = res.locals.user_id;
  friendModel.getFriendLists(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/requests', (req, res) => {
  const userId = res.locals.user_id;
  friendModel.getFriendRequests(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/pendings', (req, res) => {
  const userId = res.locals.user_id;
  friendModel.getFriendPendings(userId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/:friend_id', (req, res) => {
  const userId = res.locals.user_id;
  const friendId = req.params.friend_id;
  friendModel.getFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/:friend_id/add', (req, res) => {
  const userId = res.locals.user_id;
  const acceptedFriendId = req.params.friend_id;
  friendModel.addFriend(userId, acceptedFriendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      notificationDomain.addNotification({
        content: `${userId} send your friend request!`,
        type: 'friend_request',
        date: (new Date()).getTime(),
        userId: acceptedFriendId,
      })
      .then()
      .catch();
      res.json(data);
    }
  });
});

router.post('/:friend_id/accept', (req, res) => {
  const userId = res.locals.user_id;
  const friendId = req.params.friend_id;
  friendModel.acceptFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      notificationDomain.addNotification({
        content: `${friendId} accept your friend requests`,
        type: 'friend_accept',
        date: (new Date()).getTime(),
        userId,
      })
      .then()
      .catch();
      res.json(data);
    }
  });
});

router.delete('/requests', (req, res) => {
  const userId = res.locals.user_id;
  const friendId = req.query.friend_id;
  friendModel.deleteFriendRequest(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

router.delete('/:friend_id/unfriend', (req, res) => {
  const userId = res.locals.user_id;
  const friendId = req.params.friend_id;
  friendModel.deleteFriend(userId, friendId, (err, data) => {
    if (err) {
      res.status(data.status_code).send(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
