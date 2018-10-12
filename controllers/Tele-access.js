var axios = require('axios')
var debug = require('debug')('controller/Tele-access')
var DemoRC = require("./demographic-recognition")

const api_url = 'https://api.telegram.org/'

const WelcomeText = `Hi, I am Image Demographic-recognition Bot.\nSend me an image and I will give you basic information of image like age-range , gender , cultural apperance etc`
const ErrorText = `Error occurred processing this image. Please check your image and try again.`

module.exports = function(incomingMessage) {
    if(incomingMessage.message.text === '/start')
        return sendMessage(incomingMessage, WelcomeText)

    const photoArray = incomingMessage.message.photo

    //console.log(photoArray)

    const FileID = photoArray[photoArray.length - 1].file_id

    getImageStream(FileID)
    .then((res) => {
        debug("Got image stream successfully")

        return DemoRC(res)        
    }) 
    .then((res) => {
        debug("Sending photo to telegram")

        displayOutput(res, incomingMessage)
    }) 
    .catch((err) => {   
        console.log("Error in coloring image")
        
        sendMessage(incomingMessage, ErrorText)
    })

}

async function getImageStream(FileID) {
    try {
        let getFileRes = await axios.post(`${api_url}bot${process.env.BOT_TOKEN}/getFile`, {
            file_id: FileID
        })

        let ImageStream = await axios({
            method: 'get',
            url: `${api_url}file/bot${process.env.BOT_TOKEN}/${getFileRes.data.result.file_path}`,
            responseType:'stream'
        })
        debug(getFileRes.data.result)
        
        return ImageStream.data
    } 
    catch(err) {
        throw err
    }
}

function displayOutput(data, incomingMessage) {
    //console.log("heello ",data);
    axios.post(`${api_url}bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: incomingMessage.message.chat.id,
        text: data.Age ,
        reply_to_message_id: incomingMessage.message.message_id
    })
    .catch((error) => {
        debug("Error in data to telegram   ")

        if (error.response) {
            debug(error.response.data);
            debug(error.response.status);
        }
        
        debug(error.message)
        debug(error.config.data)
    })
} 

function sendMessage(incomingMessage, MessageText) {
    axios.post(`${api_url}bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: incomingMessage.message.chat.id,
        text: MessageText,
        reply_to_message_id: incomingMessage.message.message_id
    })
}
