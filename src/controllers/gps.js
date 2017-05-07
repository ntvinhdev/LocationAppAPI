const express = require('express');
const gpsModel = require('../models/gps');

const router = express.Router();

router.get('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  gpsModel.getPreviousLatlng(userId, (err, data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const lng = req.body.lng;
  const lat = req.body.lat;
  gpsModel.createCurrentLatlng(userId, lat, lng, (err, data) => {
    res.json(data);
  });
});

router.put('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  const lat = req.body.lat;
  const lng = req.body.lng;
  gpsModel.updateLatlng(userId, lat, lng, (err, data) => {
    res.json(data);
  });
});

router.delete('/', (req, res) => {
  const token = req.headers.token;
  const userId = req.headers.user_id;
  gpsModel.deleteLatlng(userId, (err, data) => {
    res.json(data);
  });
});

module.exports = router;
