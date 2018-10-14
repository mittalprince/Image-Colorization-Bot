var express = require('express');
var router = express.Router();
var validator = require('express-validator/check');

var bwController = require('../controllers/bwController')

router.post('/', validator.oneOf([
		validator.body('message.text').custom(text =>{
			return text === '/start'
		}),

		validator.body('message.photo').exists()
]), (req,res,next) =>{

	try{
		validator.validationResult(req).throw()

		bwController(req.body)
	} catch(err){
		console.log('Incomming Message is not a photo')
	}

	res.sendStatus(200)
})

module.exports = router;