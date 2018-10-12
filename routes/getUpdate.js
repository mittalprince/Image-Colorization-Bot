var express = require('express')
var router = express.Router()
var validator = require('express-validator/check')
var debug = require('debug')('route/getUpdate')

var Tele = require('../controllers/Tele-access')

/* Get update from telegram webhook */
router.post('/', validator.oneOf([
    // check if incoming message is a photu or '/start'
    validator.body('message.text').custom(text => {
        return text === '/start'
    }),
    validator.body('message.photo').exists()
]),(req, res, next) => {
    try {
        validator.validationResult(req).throw()
        
        Tele(req.body)
    } catch(err) {
        debug('Incoming message not a photu')
    }

    res.sendStatus(200)
})

module.exports = router;
