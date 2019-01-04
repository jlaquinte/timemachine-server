'use strict';

const credentials_twilio = require('../../config/credentials.json').twilio
const Twilio = require('twilio')(credentials_twilio.accountSid, credentials_twilio.authToken)

/**
 * Send img URL to Twilio
 * @param {string} 		phoneNumber
 * @param {string} 		message
 * @param {string} 		imgUrl
 * @param {function} 	callback
 */
exports.send = ( phoneNumber, imgUrl, callback) =>{

	let message = 'You were an awesome time-traveler! Share your pic using #IKEATimeMachine'

	console.log(`Sending to Twilio: \nPhone Number: ${phoneNumber} \n${message} \nImg Url: ${imgUrl}\n\n`)

	Twilio.messages.create({
		to: `+${phoneNumber}`,
		from: "+16193751158",
		body: `${message} ${imgUrl}`, /*
		mediaUrl: [`${imgUrl}`]*/
	}, function(err, message) {

		if(err){
			callback({'status':0, 'state':'twilio', debug:err})
			return console.log(err)
		}
		// Continue if no error
		console.log('MMS successfully sent.')
		callback({'status':1,  'state':'twilio', debug:''});
	});
}
