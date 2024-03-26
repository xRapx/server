const compression = require('compression')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors');

app.use(cors())

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
app.use((req, res, next) => {  // hàm middleware có 3 tham số
	const error = new Error('Not Found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => { // hàm xử lý error có 4 tham số
	const statusCode = error.status || 500
	return res.status(statusCode).json({
		status : 'error',
		code : statusCode,	
		stack : error.stack, // kiểm tra lỗi ở môi trường dev / ko dùng trên productions
		message: error.message || "Internal Server Error"
	})
})


module.exports = app