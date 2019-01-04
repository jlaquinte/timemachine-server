'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const fs = require('file-system');

const timeout = require('connect-timeout');
const time_till_timeout = 60000;

const isDev = process.env.NODE_ENV !== 'production';
const port  = isDev ? 3002 : process.env.PORT;
const app   = express();


// Set timeout for requests
app.use(timeout(time_till_timeout));
const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next();
};


// POST body parsing
app.use( bodyParser.json({ limit: '20mb' }) );
app.use(haltOnTimedout);
app.use( bodyParser.urlencoded({ limit: '20mb', extended: true }) );
app.use(haltOnTimedout);


// Create a router for API calls; all paths on api_router start with /api/
const api_router = express.Router();
app.use('/api', api_router);
app.use(haltOnTimedout);


// TODO: add CORS headers with production domain
api_router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(haltOnTimedout);


// Generic error hander: helps to suppress error messages sending headers
const errorHandler = (err, req, res, next) => {
  if (req.timedout) {
    let error_msg = `Request timed out at ${time_till_timeout / 1000} sec.`;
    console.log(`Error: ${error_msg}`);
    if (!res.headersSent) res.status(500).send({ data: { error: `${error_msg}`} });
  } else {
    console.log(err || 'Unknown error');
  }
};
app.use(errorHandler);


// Import services
const SaveToS3 = require('./src/server/services/SaveToS3');
const TextImage = require('./src/server/services/TextImage');


/**
 * Send image to AWS S3 and return the img url to send via MMS through Twilio
 * @return {Boolean} True if successful and False if it fails
 */
api_router.post('/send-text', function(req, res, next) {
  console.log('BACKEND LOG | Endpoint /send-text hit')

  if( !req.body.phoneNumber || !req.body.imgData ){
    console.log("request body is null")
    return("request body is null")
  }

  let phoneNumber = req.body.phoneNumber
  let imgData = req.body.imgData

  SaveToS3.save( imgData, function(ret) {

      console.log('BACKEND LOG | Return from S3 save')


    // let pathArr = ret.Location.split( '/' )
    // let imgUrl = 'https://photos.ikeatrivia.com/' + pathArr[4] + '/' + pathArr[5]

    //update ret.location to have a shorter/nicer url
    let imgPath = ret.Location
    var imgUrl = imgPath.replace('https://s3.amazonaws.com/photos.ikea75.com/', 'https://photos.ikeatrivia.com/');

    TextImage.send( phoneNumber, imgUrl, function(ret) {
      console.log(ret)
      if (!req.timedout && !res.headersSent) res.json({ status:ret.status, state: ret.state, debug:ret.debug });
    });

    //if (!req.timedout && !res.headersSent) res.json({ ret });
  });

});


// Fallback, if no above API services match, throw a 404
api_router.get('*', function(req, res) {
  if (!req.timedout && !res.headersSent) res.status(404).end();
});


// Use static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(haltOnTimedout);
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, 'dist','index.html'));
});
// ^^ Is this needed?


// Run Express server
app.listen(port, function onStart(err) {
  if (err) {
    console.log('error listening ---');
    console.log(err);
  }
  console.info(`==> 🌎\t Backend server listening on port %s. ${isDev ? '\n😎' : ''}`, port);
  console.log('running...');
});
