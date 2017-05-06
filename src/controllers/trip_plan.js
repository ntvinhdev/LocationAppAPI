const express = require('express');
const groupModel = require('../models/group');

// Merge parent params with their child
// https://expressjs.com/en/api.html
const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => {
  const groupId = req.params.id;
  const startTime = req.body.start_time;
  const endTime = req.body.end_time;
  groupModel.setTripPlan(groupId, startTime, endTime, (err, data) => {
    res.json(data);
  });
});

router.put('/', (req, res) => {
  const groupId = req.params.id;
  const startTime = req.body.start_time;
  const endTime = req.body.end_time;
  groupModel.updateTripPlan(groupId, startTime, endTime, (err, data) => {
    res.json(data);
  });
});

router.delete('/', (req, res) => {
  const groupId = req.params.id;
  groupModel.deleteTripPlan(groupId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;