var axios = require('axios')

var ColorImage = require('./ColorImageController')

const api_url = 'https://api.telegram.org/'

const WelcomeText = `Hi, I am Demographic Recognition Bot.\nSend me an image and I will tell gender for you.`
const ErrorText = `Error occurred processing this image. Please check your image and try again.`

module.exports = function(incommingMessage){

	if(incommingMessage.message.text === '/start')
		sendMessage(incommingMessage, WelcomeText)

	const photoArray = incommingMessage.message.photo
	const FileId = photoArray[photoArray.length -1].file_id

	getImageStream(FileId)
	.then((res) => {
		console.log('Got Image Stream')

		return ColorImage(res)
	})
	.then( (res) => {
		console.log("Sending photo to telgram")

		sendPhoto(res.output_url, incommingMessage)
	})
	.catch((err) => {
		console.log("Erro in coloring Image")

		sendMessage(incommingMessage, ErrorText)
	})
}

async function getImageStream(FileId){
	try{
		let getFileRes = await axios.post(`${api_url}bot${process.env.BOT_TOKEN}/getFIle`, {
			file_id = FileId
		}) 

		let ImageStream = await axios({
			method: 'get',
			url: `${api_url}bot${process.env.BOT_TOKEN}/${getFileRes.data.result.file_path}`,
			responseType: 'stream' 
		})
		console.log(getFileRes.data.result)

		return ImageStream.data
	}

	catch(err){
		throw err
	}
}

function sendPhoto(ImageURL ,incommingMesage){
	axios.post(`${api_url}bot${process.env.BOT_TOKEN}/sendPhoto`, {
		chat_id : incommingMesage.message.chat.id,
		photo: ImageURL,
		caption: "Colored Image",
		reply_to_message_id: incommingMesage.message.message_id
	})
	.catch((err) => {
		console.log("Erron in sending coloring Image to Telegram ")

		if(err.response){
			console.log(err.response.data)
			console.log(err.response.status)
		}

		console.log(err.message)
		console.log(err.config.data)
	})
}

function sendMessage(incommingMesage, MessageText){
	axios.post(`${api_url}bot${process.env.BOT_TOKEN}/sendMessage`, {
		chat_id : incommingMesage.message.chat.id,
		text: MessageText
		reply_to_message_id: incommingMesage.message.message_id
	})
}