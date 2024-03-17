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
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))
// init db
require('./bds/init.mongodb')
// const {checkOverLoad} = require('./helpers/check.connect')
// checkOverLoad()

// init routes
app.use('/', require('./routes'))

// handing error


module.exports = app