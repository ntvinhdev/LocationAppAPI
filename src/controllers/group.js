const express = require('express');
const groupModel = require('../models/group');
const groupDomain = require('../domains/group');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.use(authMiddleware.isUserAuthenticated);

router.get('/', (req, res) => {
  const { user_id: userId } = res.locals;
  groupDomain.showMessageList(userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/', (req, res) => {
  const { user_id: userId } = res.locals;
  // Support group_name as a legacy field.
  const { group_name: groupName, name } = req.body;
  groupDomain.createNewGroup(name || groupName, userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.get('/:group_id', (req, res) => {
  const { group_id: groupId } = req.params;
  groupDomain.getGroup(groupId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

router.post('/:group_id/members', (req, res) => {
  const { group_id: groupId } = req.params;
  const { friend_id: friendId, user_id: userId } = req.query;
  groupDomain.addUserIntoGroup(groupId, friendId || userId)
    .then(data => res.json(data))
    .catch((error) => {
      const message = JSON.parse(error.message);
      res.status(message.status_code || 501).send(message);
    });
});

module.exports = router;
