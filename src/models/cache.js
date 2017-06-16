const CacheGlobal = require('../globals/cache');

const cache = (new CacheGlobal()).getInstance();

function setUserValue(userId, data) {
  return new Promise((resolve) => {
    let latlng;
    if (data.latlng.lat === undefined) {
      latlng = { lat: 0, lng: 0 };
    } else {
      latlng = {
        lat: data.latlng.lat,
        lng: data.latlng.lng,
      };
    }
    cache.set(JSON.stringify(userId), {
      _id: data.id, latlng,
    }, ((error, success) => {
      if (!error && success) {
        const value = cache.get(JSON.stringify(userId));
        if (value !== undefined) {
          resolve(value);
        }
      }
    }));
  });
}

function getUserValue(userId) {
  return cache.get(userId);
}

module.exports = {
  setUserValue,
  getUserValue,
};