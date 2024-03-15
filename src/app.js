const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const app = express()

// init middleware
app.use(morgan("dev")) // mode dev
// morgan("combined") //  mode production
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(compression())

// init db
require('./bds/init.mongodb')
const {checkOverLoad} = require('./helpers/check.connect')
checkOverLoad()
// init routes
app.get('/' , (req, res, next) =>{
	return res.status(200).json({
		message: "Hello World"
	})
})

// handing error


module.exports = app