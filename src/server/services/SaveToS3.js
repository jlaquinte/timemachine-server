'use strict';

const credentials_aws = require('../../config/credentials.json').aws
const AWS = require('aws-sdk')
const shortid = require('shortid');


AWS.config.update({ accessKeyId: credentials_aws.accessKeyId, secretAccessKey: credentials_aws.secretAccessKey })
AWS.config.region = 'us-east-1'

const S3 = new AWS.S3()

/**
 * Save image base64 data into s3 bucket
 * @param {string}		base64 - base64 image data
 * @param {function}	callback - callback function
 */
exports.save = (base64, callback) =>{

	if(!base64){
		callback("no base64 data")
		return
	}

	// Getting the file type, ie: jpeg, png or gif
	let base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
	//let type = base64.split(';')[0].split('/')[1]
	let type = 'png' //default to png if no type because c++ encoding may not include type
	let currDate = ( new Date() ).toJSON()
	let fileName = `poster_${currDate.substr(0, 10)}-${currDate.substr(11, 8).replace(/:/gi,'')}.png`

	let uniquePath = shortid.generate()+currDate.substr(15, 3).replace(/:/gi,'')

	let params = {
		Bucket: credentials_aws.bucket_name,
		Key: `${uniquePath}/${fileName}`, // type is not required
		Body: base64Data,
		ACL: 'public-read',
		ContentEncoding: 'base64', // required
		ContentType: `image/${type}` // required. Notice the back ticks
	}

	// upload to amazon s3
	S3.upload(params, (err, data) => {
		if (err) { 
			callback({'status':0, 'state':'s3', debug:err})
			return console.log(err) 
		}
		// Continue if no error
		console.log('Image successfully uploaded.')
		callback(data);
	});
}

