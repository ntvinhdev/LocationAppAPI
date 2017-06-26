/* eslint-disable no-unused-vars */

const fs = require('fs');
const config = require('./src/config');
const express = require('express');
const locationAppAPI = require('./src');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const bluebird = require('bluebird');
// Firebase FCM configure
const admin = require('firebase-admin');
const serviceAccount = require('./src/config/serviceAccountKey.json');
// Use cluster to help Node.JS run in multi-thread
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
// Compress with gzip
const compression = require('compression');
// Protect server
const helmet = require('helmet');

const app = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Exclude these express plugin in production
if (app.get('env') !== 'production') {
  app.use(logger('dev'));
}

// main routes pointer
app.use('/', locationAppAPI.router);

// Handle on 404 error in json instead html or text.
// http://stackoverflow.com/a/9802006/5557789
app.use((req, res, next) => {
  res.status(404);
  // respond with json
  if (req.accepts('json')) {
    res.status(404).send({
      status_code: 404,
      success: true,
      status_message: 'Not found.',
    });
  }
});

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({
      status_code: 500,
      success: false,
      status_message: 'Internal server error.',
    });
  } else {
    res.status(501).send({
      status_code: 501,
      success: false,
      status_message: err.message,
    });
  }
});

// Fix deprecation warning mpromise
// by using the default promise of Node.js.
// https://github.com/Automattic/mongoose/issues/4291
// In this case, we use bluebird.
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = bluebird;
mongoose.connect(config.dbURI);

// Log an error if the connection fails
mongoose.connection.on('error', (error) => {
  console.log(error);
});

// Firebase configuration

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://locationapp-f02ac.firebaseio.com/',
});

//  Make cluster run in current multi-thread in CPU
// (() => {
//   if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);
//     // Fork workers.
//     for (let i = 0; i < numCPUs; i += 1) {
//       cluster.fork();
//     }
//     // Exit fork.
//     cluster.on('exit', (worker, code, signal) => {
//       console.log(`worker ${worker.process.pid} died`);
//     });
//   } else {
//     // Start server.
//     console.log(`Worker ${process.pid} started`);
    locationAppAPI.ioServer(app).listen('/tmp/nginx.socket', () => {
      if (process.env.DYNO) {
        console.log('This is on Heroku..!!');
        fs.openSync('/tmp/app-initialized', 'w');
      }
      console.log('LocationAppAPI is running on Port:', app.get('port'));
    });
//   }
// })();
