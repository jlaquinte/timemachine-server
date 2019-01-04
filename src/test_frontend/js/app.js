/*
** Quickly put together function that allows me 
** to test the application from a test page I set up
*/

(()=>{

	// base64 dummy data to send
	let imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAABECAYAAAAyTz3gAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJDNEI5N0VGNzYxRDExRTg5REZCQUM5MkY0NkM1NUMwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJDNEI5N0YwNzYxRDExRTg5REZCQUM5MkY0NkM1NUMwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkM0Qjk3RUQ3NjFEMTFFODlERkJBQzkyRjQ2QzU1QzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkM0Qjk3RUU3NjFEMTFFODlERkJBQzkyRjQ2QzU1QzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50mCplAAAIlElEQVR42uSbX0xb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'

	// grabbing DOM elms
	let sendTextBtn = document.querySelector('.send-text-button')
	let phoneNumberInput = document.querySelector('.phone-number')
	let status = document.querySelector('.status')
	let testImg = document.querySelector('.test-img')
	let message = "You were an awesome time-traveler! Share your pic using #IKEATimeMachine"

	// load the empty image with the base64 data
	testImg.src = imgData

	// hit twilio endpoint on click of button
	sendTextBtn.addEventListener('click',()=>{
		console.log('Send Text')

		let phoneNumber = phoneNumberInput.value

		if( !phoneNumber ) return null

		console.log(phoneNumber, imgData, message)

		let apiURL = `http://localhost:3002/api/send-text`
		new Promise((resolve, reject) => {
			fetch(apiURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					"phoneNumber": phoneNumber,
					"imgData": imgData,
					"message": message
				})
			}).then((response)=>{
				resolve(response)
				console.log(response)
				status.innerHTML = `Your text has sent to the </br>NodeJS server successfully`

			})
			.catch((error) => {
				console.log(error)
				status.innerHTML = `Error: ${error}`
				reject(error);
			});
		});
	})

})()
